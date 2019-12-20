import json
import base64
from lambda_text_predictor_model import LambdaTextPredictorModel

def handler(event, context):
    data = json.loads(event['body'])
    encoded_image = data['image']
    decoded_image = base64.decodebytes(encoded_image)
    model = LambdaTextPredictorModel()
    model.predict(decoded_image)
