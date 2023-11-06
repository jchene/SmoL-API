import cv2
import math
import json
import boto3
import random
import itertools
import numpy as np
import urllib.request
from sklearn.cluster import DBSCAN

#Wall detection constants
KERNEL_SIZE=(2, 2)
WALL_THRESHOLD=[128, 255]
MORPHOLOGY_ITERATIONS=2
AREA_THRESHOLD=300
DILATE_ITERATIONS=1

#Desk detection constants
DESK_THRESHOLD = 0.6
DUPLICATES_THRESHOLD = 50
ALIGN_THRESHOLD = 5
GROUP_MAX_DIST = 80
BASE_TEMPLATE_DIRECTION = 'left'

#AWS constants
BUCKET = 'jchene-first-sst-app-createb-assetsbucket5f3b285a-ke23l8et3h37'
REGION = 'eu-west-1'
FLOOR_NAME = '44aabd29-fed5-420a-84fa-523bd918cef8'
TEMPLATE_NAMES = [ '0deb27d3-8760-4819-8577-74c5e8df9c44' ]

def get_walls(image):
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	_, thresh = cv2.threshold(gray, WALL_THRESHOLD[0], WALL_THRESHOLD[1], cv2.ADAPTIVE_THRESH_GAUSSIAN_C)
	kernel = np.ones(KERNEL_SIZE, np.uint8)
	opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=MORPHOLOGY_ITERATIONS)
	background = cv2.dilate(opening, kernel, iterations=DILATE_ITERATIONS)
	return background

def remove_small_objects(image):
	num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(image, connectivity=8)
	min_area_threshold = AREA_THRESHOLD
	filtered_image = np.zeros_like(image)
	for label in range(1, num_labels):
		area = stats[label, cv2.CC_STAT_AREA]
		if area >= min_area_threshold:
			filtered_image[labels == label] = 255
	return filtered_image

#Invert colors of an image
def invert_image(image):
	return 255 - image

# Get image from bucket using name
def getImageFromBucket(name):
	image_url = 'https://' + BUCKET + ".s3." + REGION + ".amazonaws.com/" + name
	req = urllib.request.urlopen(image_url)
	arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
	image = cv2.imdecode(arr, -1)
	return image

# Get templates images from bucket using name array
def getTemplates(names):
	templates = []
	direction = BASE_TEMPLATE_DIRECTION
	for i in range(0, len(names)):
		base_template = getImageFromBucket(names[i])
		full_base_template = { 'template': base_template, 'direction': direction }
		templates.append(full_base_template)
		for j in range(0, 3):
			base_template = cv2.rotate(base_template, cv2.ROTATE_90_CLOCKWISE)
			match direction:
				case 'left':
					direction = 'top'
				case 'top':
					direction = 'right'
				case 'right':
					direction = 'bottom'
				case 'bottom':
					direction = 'left'
				case _:
					direction = 'left'
			full_template = { 'template': base_template, 'direction': direction }
			templates.append(full_template)
	return templates

# Remove duplicates from point list
def remove_duplicates(points):
	points_to_remove = []
	for point1, point2 in itertools.combinations(points, 2):
		if math.dist(point1, point2) < DUPLICATES_THRESHOLD:
			points_to_remove.append(point2)
	points_to_keep = [point for point in points if point not in points_to_remove]
	return points_to_keep

# Adds an offset to place the circle at the center of the desk
def circle_position_offset(positions, grey_scale_template):
	w, h = grey_scale_template.shape[::-1]
	new_positions = []
	for pos in positions:
		new_positions.append([int(pos[0] + (w / 1.9)), int(pos[1] + (h / 2))])
	return new_positions

# Aligns points that are too close to each other
def align_points(positions):
	sorted_pos = sorted(positions, key=lambda x: x['position'][0])
	lastx = -1
	for pos in sorted_pos:
		if (abs(pos['position'][0] - lastx) < ALIGN_THRESHOLD):
			pos['position'][0] = lastx
		lastx = pos['position'][0]
	sorted_pos = sorted(sorted_pos, key=lambda x: x['position'][1])
	lasty = -1
	for pos in sorted_pos:
		if (abs(pos['position'][1] - lasty) < ALIGN_THRESHOLD):
			pos['position'][1] = lasty
		lasty = pos['position'][1]
	return sorted_pos

#NEED UPDATE WITH DIRECTIONS
#Sorts points by group then sorts points in each group by x or y
def sort_by_group(points, groupMethod, pointMethod):
	clustering = DBSCAN(eps=GROUP_MAX_DIST, min_samples=2).fit(points)
	labels = clustering.labels_
	groups = {}
	for label, point in zip(labels, points):
		if label not in groups:
			groups[label] = []
		groups[label].append(list(point))	
	for label in groups:
		match pointMethod:
			case "y":
				groups[label] = sorted(groups[label], key=lambda x: (x[1], x[0]))
			case _:
				groups[label] = sorted(groups[label], key=lambda x: (x[0], x[1]))
	match groupMethod:
		case "y":
			sorted_groups = sorted(groups.values(), key=lambda x: (x[0][1], x[0][0]))
		case _:
			sorted_groups = sorted(groups.values(), key=lambda x: (x[0][0], x[0][1]))
	final_list = [point for group in sorted_groups for point in group]
	return final_list

# Sorts points using different methods
def sort_points(points, method, groupMethod, pointMethod):
	match method:
		case "y":
			return sorted(points, key=lambda x: (x['position'][1], x['position'][0]))
		#case "g":
		#	return sort_by_group(points, groupMethod, pointMethod)
		case _:
			return sorted(points, key=lambda x: (x['position'][0], x['position'][1]))

# Encode and uploads on the bucket the result_image
def putImageToBucket(s3, result_image):
	image_string = cv2.imencode('.jpg', result_image)[1].tostring()
	result_name = str(random.randint(100000000, 999999999)) + ".jpg"
	s3.Object(BUCKET, result_name).put(Body=image_string)
	return result_name

# Create a list of dictionaries from a list of positions
def create_dict_list(positions):
	list = []
	for pos in positions:
		dict = {}
		dict['x'] = pos['position'][0]
		dict['y'] = pos['position'][1]
		dict['direction'] = pos['direction']
		list.append(dict)
	return list

# Lambda handler
def lambda_handler(event, context):
	s3 = boto3.resource(
		service_name='s3',
		aws_access_key_id='AKIAXC3MIHYK3FLR7IGJ',
		aws_secret_access_key='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'
	)
	templates = getTemplates(TEMPLATE_NAMES)
	floor = getImageFromBucket(FLOOR_NAME)
	grey_scale_floor = cv2.cvtColor(floor, cv2.COLOR_BGR2GRAY)

	positions_w_direction = []
	for i in range(0, len(templates)):
		grey_scale_template = cv2.cvtColor(templates[i]['template'], cv2.COLOR_BGR2GRAY)
		results = cv2.matchTemplate( grey_scale_floor, grey_scale_template, cv2.TM_CCOEFF_NORMED)
		locations = np.where(results >= DESK_THRESHOLD)
		positions = []
		for pt in zip(*locations[::-1]):
			positions.append([int(pt[0]), int(pt[1])])
		positions = remove_duplicates(positions)
		circle_positions = circle_position_offset(positions, grey_scale_template)
		for j in range(0, len(circle_positions)):
			positions_w_direction.append({ 'position': circle_positions[j], 'direction': templates[i]['direction'] })
	print("positions:", positions_w_direction)
	aligned_positions = align_points(positions_w_direction)
	print("aligned:", aligned_positions)
	sorted_positions = sort_points(aligned_positions, "", "y", "x")
	print("sorted:", sorted_positions)

	dict = create_dict_list(sorted_positions)
	print(dict)

	response_data = {
		'url': 'https://' + BUCKET + ".s3." + REGION + ".amazonaws.com/" + FLOOR_NAME,
		'positions' : dict
	}
	response_json = json.dumps(response_data)
	return {
		'statusCode': 200,
		'body': response_json
	}
