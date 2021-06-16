import numpy as np
from PIL import Image

image = Image.open('./image.png')
image_array = np.array(image)

print(image_array.size)