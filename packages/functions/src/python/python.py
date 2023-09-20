import boto3
import cv2
import numpy as np
import urllib.request

def lambda_handler(event, context):
	# Constants
	bucket_name = 'jchene-first-sst-app-createb-assetsbucket5f3b285a-ke23l8et3h37'
	region_name='eu-west-1'
	threshold = 0.65

	# S3 Initialisation
	s3 = boto3.resource(
		service_name='s3',
		region_name=region_name,
		aws_access_key_id='AKIAXC3MIHYK3FLR7IGJ',
		aws_secret_access_key='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'
	)

	#Template reading
	floor_name='46431b96-cb43-406b-9370-f7ed68dd2a8d'
	templateNames = [
		'05c91e3b-1e5d-497d-91f5-c8375f742c2f',
		'47820803-05ab-4400-9a7a-e7d66284f86d'
	]
	# templateNames = []
	templates = []
	for i in range(0, len(templateNames)):
		templateUrl='https://' + bucket_name + ".s3." + region_name + ".amazonaws.com/" + templateNames[i]
		req = urllib.request.urlopen(templateUrl)
		arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
		templates.append(cv2.imdecode(arr, -1))

	#Floor reading
	floorUrl='https://' + bucket_name + ".s3." + region_name + ".amazonaws.com/" + floor_name
	req = urllib.request.urlopen(floorUrl)
	arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
	floor = cv2.imdecode(arr, -1)

	#Getting grey_scales
	grey_scales = []
	for i in range(0, len(templates)):
		grey_scales.append(cv2.cvtColor(templates[i], cv2.COLOR_BGR2GRAY))
	grey_scale_floor = cv2.cvtColor(floor, cv2.COLOR_BGR2GRAY)

	#Find templates
	body = ""
	for i in range(0, len(templates)):
		result = cv2.matchTemplate(grey_scale_floor, grey_scales[i], cv2.TM_CCOEFF_NORMED)
		locations = np.where(result >= threshold)
		w, h = grey_scales[i].shape[::-1]
		nb_desks = 0
		for pt in zip(*locations[::-1]):
			nb_desks += 1
			cv2.rectangle(floor, pt, (pt[0] + w, pt[1] + h), (0, 255, 0), 1)
		body += "Found " + str(nb_desks) + " of template " + templateNames[i] + " in this floor\n"

	# Image encoding
	image_string = cv2.imencode('.jpg', floor)[1].tostring()
	s3.Object(bucket_name, 'result.jpg').put(Body=image_string)

	return {
		'statusCode': 200,
		'body': body
	}
