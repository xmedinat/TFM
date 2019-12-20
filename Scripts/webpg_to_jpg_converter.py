from PIL import Image
import os

for (dirname, dirs, files) in os.walk("./Data"):
     for filename in files:
         if filename.endswith('.webp'):
             original_name = filename
             print('found: ' + os.path.splitext(filename)[0])
             print('converting to: ' + os.path.splitext(filename)[0] + '.jpg')
             path = dirname + "/" + filename
             im = Image.open(path).convert("RGB")
             im.save(os.path.splitext(path)[0] + '.jpg', "jpeg")
             print('done converting…')
             os.remove(dirname + "/" + original_name)