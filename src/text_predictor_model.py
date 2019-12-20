from keras.models import model_from_yaml
from keras.preprocessing.sequence import pad_sequences
from keras.preprocessing import image
from keras.applications.inception_v3 import preprocess_input
from keras.models import Model
from keras.applications import InceptionV3
import pickle
import numpy as np

class TextPredictorModel(object):

    max_length = 19

    def __init__(self, predicted_product):
        model_to_load = "all"
        if predicted_product == "business-card":
            model_to_load = "bc"
            self.max_length = 18
        elif predicted_product == "banners":
            model_to_load = "banners"
        yaml_file = open('../Model/caption_pred_model_{0}.yaml'.format(model_to_load), 'r')
        loaded_model_yaml = yaml_file.read()
        yaml_file.close()
        self.model = model_from_yaml(loaded_model_yaml)
        self.model.load_weights("../Model/caption_pred_model_{0}.h5".format(model_to_load))
        with open('../Model/corpus_{0}.txt'.format(model_to_load), 'rb') as corpus_file:
            self.corpus = pickle.load(corpus_file)
        self.word_to_position = {}
        self.position_to_word = {}
        position = 1
        for word in self.corpus:
            self.word_to_position[word] = position
            self.position_to_word[position] = word
            position += 1

        inceptionV3_model = InceptionV3(weights='imagenet')
        self.model_inception = Model(inceptionV3_model.input, inceptionV3_model.layers[-2].output)

    def predict(self, image_path):
        image = self._encode(image_path, self.model_inception)
        image = image.reshape((1,2048))
        in_text = '#START'
        for i in range(self.max_length):
            sequence = [self.word_to_position[w] for w in in_text.split() if w in self.word_to_position]
            sequence = pad_sequences([sequence], maxlen=self.max_length)
            yhat = self.model.predict([image, sequence], verbose=0)
            yhat = np.argmax(yhat)
            word = self.position_to_word[yhat]
            in_text += ' ' + word
            if word == '#END':
                break
        final = in_text.split()
        final = final[1:-1]
        final = ' '.join(final)
        return final

    def _prepare_image(self,image_path):
        img = image.load_img(image_path, target_size=(299, 299))
        array = image.img_to_array(img)
        array = np.expand_dims(array, axis=0)
        preprocessed_image = preprocess_input(array)
        return preprocessed_image

    def _encode(self, image, model):
        preprocessed_image = self._prepare_image(image)
        encoded_vector = model.predict(preprocessed_image)
        encoded_vector = np.reshape(encoded_vector, encoded_vector.shape[1])
        return encoded_vector