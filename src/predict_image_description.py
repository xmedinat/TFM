import argparse
from prediction_pipeline import PredictionPipeline

def predict_image_description(image):
    prediction_pipeline = PredictionPipeline()
    prediction = prediction_pipeline.predict(image)
    print(prediction)

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description="This process will predict a caption for the image you pass as an argument:")
    ap.add_argument('--image', help='Full path of the image or relative to this script')
    args = ap.parse_args()

    predict_image_description(args.image)