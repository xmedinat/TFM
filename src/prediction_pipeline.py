from classification_model import ClassificationModel
from business_card_shape_model import BusinessCardShapeModel
from banner_type_model import BannerTypeModel
from text_predictor_model import TextPredictorModel

class PredictionPipeline(object):

    def __init__(self):
        self.classification_model = ClassificationModel()
        self.bc_shape_model = BusinessCardShapeModel()
        self.banner_type_model = BannerTypeModel()

    def predict(self, image):
        print("Running product classification model")
        product_type = self.classification_model.predict(image)
        print("Predicted: {0}".format(product_type))
        if product_type == "business-card":
            print("Running business card shape model")
            features = [self.bc_shape_model.predict(image)]
            print("Predicted: {0}".format(features))
        elif product_type == "banner":
            print("Running banner type model")
            features = [self.banner_type_model.predict(image)]
            print("Predicted: {0}".format(features))
        else:
            features = []

        text_predictor_model = TextPredictorModel(product_type)
        print("Running text prediction model")
        text_prediction = text_predictor_model.predict(image)

        return self._correct_prediction(text_prediction, product_type, features)

    def _correct_prediction(self, text_prediction, product_type, features):
        final_prediction = text_prediction
        if product_type in text_prediction:
            for feature in features:
                if feature not in text_prediction:
                    if product_type == "business-card":
                        word_to_replace = self._find_previous_word(text_prediction, "corner")
                        final_prediction = text_prediction.replace(word_to_replace, feature)
                    if product_type == "banners":
                        word_to_replace = self._find_previous_word(text_prediction, "banner")
                        if word_to_replace is None:
                            word_to_replace = self._find_previous_word(text_prediction, "banners")
                        final_prediction = text_prediction.replace(word_to_replace, feature)
        return final_prediction

    @staticmethod
    def _find_previous_word(text_prediction, keyword):
        words = text_prediction.split(' ')
        counter = 0
        for word in words:
            if word == keyword:
                return words[counter - 1]
            else:
                counter+=1
        return None