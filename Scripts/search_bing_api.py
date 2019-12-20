from requests import exceptions
import argparse
import requests
import cv2
import os

ap = argparse.ArgumentParser()
ap.add_argument("-q", "--query", required=True,
	help="search query to search Bing Image API for")
ap.add_argument("-o", "--output", required=True,
	help="path to output directory of images")
ap.add_argument("-k", "--api_key", required=True,
	help="Microsoft Cognitive Services API key")
args = vars(ap.parse_args())

API_KEY = args["api_key"]
MAX_RESULTS = 1000
GROUP_SIZE = 50
URL = "https://api.cognitive.microsoft.com/bing/v7.0/images/search"
EXCEPTIONS = {IOError, FileNotFoundError, exceptions.RequestException, exceptions.HTTPError, exceptions.ConnectionError,
			  exceptions.Timeout}

term = args["query"]
headers = {"Ocp-Apim-Subscription-Key" : API_KEY}
params = {"q": term, "offset": 0, "count": GROUP_SIZE}

search = requests.get(URL, headers=headers, params=params)
search.raise_for_status()
results = search.json()
estNumResults = min(results["totalEstimatedMatches"], MAX_RESULTS)
total = 0

for offset in range(0, estNumResults, GROUP_SIZE):
	params["offset"] = offset
	search = requests.get(URL, headers=headers, params=params)
	search.raise_for_status()
	results = search.json()

	for v in results["value"]:
		try:
			r = requests.get(v["contentUrl"], timeout=30)
			ext = v["contentUrl"][v["contentUrl"].rfind("."):]
			p = os.path.sep.join([args["output"], "{}{}".format(
				str(total).zfill(8), ext)])

			f = open(p, "wb")
			f.write(r.content)
			f.close()

		except Exception as e:
			if type(e) in EXCEPTIONS:
				print("Failed to download the image {0}".format(v["contentUrl"]))
				continue

		image = cv2.imread(p)
		if image is None:
			print("Could not open {0}, removing from disk".format(p))
			os.remove(p)
			continue

		total += 1