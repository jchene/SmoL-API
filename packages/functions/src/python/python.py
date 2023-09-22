import cv2
import math
import boto3
import random
import itertools
import numpy as np
import urllib.request

# Get templates images from bucket using name array
def getTemplates(bucket, region, names):
	templates = []
	for i in range(0, len(names)):
		templateUrl = 'https://' + bucket + ".s3." + region + ".amazonaws.com/" + names[i]
		req = urllib.request.urlopen(templateUrl)
		arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
		templates.append(cv2.imdecode(arr, -1))
	return templates

# Get floor from bucket using name
def getFloor(bucket, region, name):
	floor_url = 'https://' + bucket + ".s3." + region + ".amazonaws.com/" + name
	req = urllib.request.urlopen(floor_url)
	arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
	floor = cv2.imdecode(arr, -1)
	return floor

# Remove duplicates from point list
def remove_duplicates(points, threshold=5):
	points_to_remove = []
	for point1, point2 in itertools.combinations(points, 2):
		if math.dist(point1, point2) < threshold:
			points_to_remove.append(point2)
	points_to_keep = [point for point in points if point not in points_to_remove]
	return points_to_keep

# Draw rectangles into result_image
def draw_rectangles(points, result_image, template_grey_scale, template_name):
	nb_desks = 0
	w, h = template_grey_scale.shape[::-1]
	r = random.randint(0, 2)
	rectangle_color = (255 if r == 0 else 0, 255 if r == 1 else 0, 255 if r == 2 else 0)
	for pos in points:
		cv2.rectangle(result_image, pos, (pos[0] + w, pos[1] + h), rectangle_color, 1)
		nb_desks += 1
	print("Found " + str(nb_desks) + " of template " + template_name + " in this floor\n")

# Encode and uploads on the bucket the result_image
def encode_image(s3, bucket, result_image):
	image_string = cv2.imencode('.jpg', result_image)[1].tostring()
	result_name = str(random.randint(0, 999999999)) + ".jpg"
	s3.Object(bucket, result_name).put(Body=image_string)
	return result_name


def lambda_handler(event, context):
	bucket = 'jchene-first-sst-app-createb-assetsbucket5f3b285a-ke23l8et3h37'
	region = 'eu-west-1'
	threshold = 0.6
	floor_name = '46431b96-cb43-406b-9370-f7ed68dd2a8d'
	template_names = [ '05c91e3b-1e5d-497d-91f5-c8375f742c2f', '47820803-05ab-4400-9a7a-e7d66284f86d' ]

	s3 = boto3.resource(
		service_name='s3',
		region=region,
		aws_access_key_id='AKIAXC3MIHYK3FLR7IGJ',
		aws_secret_access_key='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'
	)
	templates = getTemplates(bucket, region, template_names)
	result_image = floor = getFloor(bucket, region, floor_name)
	grey_scale_floor = cv2.cvtColor(floor, cv2.COLOR_BGR2GRAY)

	for i in range(0, len(templates)):
		grey_scale_template = cv2.cvtColor(templates[i], cv2.COLOR_BGR2GRAY)
		results = cv2.matchTemplate( grey_scale_floor, grey_scale_template, cv2.TM_CCOEFF_NORMED)
		locations = np.where(results >= threshold)
		positions = []
		for pt in zip(*locations[::-1]):
			positions.append([pt[0], pt[1]])
		positions = remove_duplicates(positions, 5)
		draw_rectangles(positions, result_image, grey_scale_template, template_names[i])
	result_name = encode_image(s3, bucket, result_image)
	
	return {
		'statusCode': 200,
		'body': 'https://' + bucket + ".s3." + region + ".amazonaws.com/" + result_name
	}
