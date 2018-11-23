# USAGE
# python test_network.py --model santa_not_santa.model --image images/examples/santa_01.png

# import the necessary packages
from keras.preprocessing.image import img_to_array
from keras.models import load_model
from keras import backend as K
import tensorflow as tf
import numpy as np
import cv2
import os


def test_network(test_image, model_name, folder):
	K.clear_session()

	# load the image
	image = cv2.imread(test_image)

	# pre-process the image for classification
	image = cv2.resize(image, (28, 28))
	image = image.astype("float") / 255.0
	image = img_to_array(image)
	image = np.expand_dims(image, axis=0)

	# load the trained convolutional neural network
	print("[INFO] loading network...")
	model = load_model(model_name)

	K.set_session(tf.Session(graph=model.output.graph))
	init = K.tf.global_variables_initializer()
	K.get_session().run(init)

	classes = []

	if os.path.exists(folder):
		for dirname in os.listdir(folder):
			classes.append(dirname)

	classes = sorted(classes)

	# classify the input image
	output = model.predict(image)[0]

	print(classes)
	print(output)

	os.remove(test_image)

	maxAcc = max(output)

	index = np.where(output == maxAcc)[0][0]

	# build the label
	label = classes[index]

	proba = maxAcc

	return label + ': ' + str(round(proba*100)) + '%'
