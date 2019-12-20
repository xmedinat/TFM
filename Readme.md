# Automatic Image Captioning
This project has been developed for the TFM in UOC (Universitat oberta de Catalunya). The project consists in a model that can automatically generate captions for images of a small amount of promotional and merchandise products such as Business cards or banners.

# Dependencies:
You will need the following packages installed in a 3.6+ Python to make the following notebooks and scripts work:

* keras
* pandas
* numpy
* pillow
* matplotlib
* pickle
* requests
* cv2

# Dataset
Download the data set from https://drive.google.com/file/d/1vdtQLlP78jW4hGh-EMLOIvrQJoSyEs4X/view?usp=sharing and put its content into a folder named Data, the structure of the folder should look like:;

```
Data
| - BannerClassifier
|    | - test
|    |   | - mesh
|    |   | - roller
|    |   | - vynil
|    | - train
|    |   | - mesh
|    |   | - roller
|    |   | - vynil
| - BusinessCardClassifier
|    | - shape
|    |   | - test
|    |   |   | - rounded
|    |   |   | - squared
|    |   | - train
|    |   |   | - rounded
|    |   |   | - squared
| - CaptionPredictionData
|    | - Data
|    |   | - test
|    |   |   | - all
|    |   |   | - banners
|    |   |   | - business_cards
|    |   | - train
|    |   |   | - all
|    |   |   | - banners
|    |   |   | - business_cards
|    | - glove
| - GeneralProductClassifier
|    | - Competitors_tests
|    | - test
|    |   | - bags
|    |   | - banners
|    |   | - business-card
|    |   | - door-hanger
|    |   | - hats
|    |   | - mugs
|    |   | - office-signs
|    |   | - pens
|    |   | - phone-cases
|    |   | - stamps
|    |   | - table-covers
|    |   | - usb-flash-drives
|    | - train
|    |   | - bags
|    |   | - banners
|    |   | - business-card
|    |   | - door-hanger
|    |   | - hats
|    |   | - mugs
|    |   | - office-signs
|    |   | - pens
|    |   | - phone-cases
|    |   | - stamps
|    |   | - table-covers
|    |   | - usb-flash-drives
```
Although some data is repeated, this is to ensure data can be changed without affecting any model, so everything is isolated between them.

# Models

Models yaml files and weights can be downloaded from https://drive.google.com/file/d/1iGk1ar9lqJXi1otIEh-5aZWHLcBgYRb-/view?usp=sharing

# Notebooks

* __ProductClassifier__: Model to classify an image between 12 different products
* __ProductClassifierModelExecution__: Notebook to tests the ProductClassifier model's behavior
* __BannerClassifier__: Model to classify the banners into its different 3 types 
* __BusinessCardShapeClassifier__: Model to classify the business cards into its different 2 types of corner shape
* __DescriptionPredictorModel__: Model to predict the description of an image (business cards and banners only)
* __DescriptionPredictorModel-Banners__: Model to predict the description of a banner image
* __DescriptionPredictorModel-BusinessCards__: Model to predict the description of a business card image

# Execute in local

To execute the prediction pipeline in local, run the following command:
```
cd src
python predict_image_description.py --image 'PATH_TO_IMAGE_TO_DESCRIBE'
```

Example:
```
python predict_image_description.py --image "../Data/BusinessCardClassifier/shape/test/squared/00000006.jpg"
```

# Deploy into AWS

To deploy this model as a lambda function in AWS, make sure you have a user with enough permissions to store files in S3, create Lambda Functions, create an API Gateway and is able to retrieve certificates.

Then transpile the typescript into javascript by executing
```
npm run build
```

Then call:
```
cdk build -c CERTIFICATE_ARN=YOUR_CERTIFICATE_ARN DOMAIN_NAME=YOUR_DOMAIN_NAME
```

This will create a stack and all the needed infrastructure in your AWS account and make the model available to be consumed through a POST request.

# Scripts

In the scripts folders there are two utility scripts:

* __search_bing_api.py__: This script can consume the Bing cognitive API from Microsoft to scrap images given a keyword and store them in the desired place. This has been used to obtain many of the images used in the data sets.
```
python Scripts/search_bing_api.py --query "business-cards" --output "my-folder" --api_key "BING_API_KEY"
```
* __webpg_to_jpg_converter.py__: When scraping images, many of them come in a popular format for browsers called webpg, but some of the Python libraries do not work well with this images, so this scripts handles this issue by transforming all webpg images into jpg. To execute this one just change the targeting folder in the script.