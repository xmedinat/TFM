from keras.models import model_from_yaml
from keras.preprocessing import image
import numpy as np

class BannerTypeModel(object):

    class_labels = ["mesh", "roller", "vynil"]

    def __init__(self):
        yaml_file = open('../Model/banner_classification_vgg16_model.yaml', 'r')
        loaded_model_yaml = yaml_file.read()
        yaml_file.close()
        self.vgg16 = model_from_yaml(loaded_model_yaml)
        self.vgg16.load_weights("../Model/banner_classification_vgg16.h5")

        yaml_file = open('../Model/banner_classification_model.yaml', 'r')
        loaded_model_yaml = yaml_file.read()
        yaml_file.close()
        self.classification_model = model_from_yaml(loaded_model_yaml)
        self.classification_model.load_weights("../Model/banner_classification_model.h5")
        self.img_width = 256
        self.img_height = 256

    def predict(self, image_path):
        img = image.load_img(image_path, target_size=(self.img_width, self.img_height))
        y = image.img_to_array(img)
        y = np.expand_dims(y, axis=0)
        images = np.vstack([y])
        bottleneck_output = self.vgg16.predict(images)
        prediction = self.classification_model.predict(bottleneck_output)
        predicted_classes = prediction.argmax(axis=-1)
        return self.class_labels[predicted_classes[0]]