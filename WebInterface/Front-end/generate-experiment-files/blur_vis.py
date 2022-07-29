# -*- coding: utf-8 -*-
"""
Created on Thu Jul  8 17:53:59 2021

@author: jiao1
"""

from PIL import Image, ImageFilter 
from pathlib import Path

current_path = Path('./')

for i in range(1,11):
    p = current_path.joinpath(str(i))
    out_path = current_path.joinpath(str(i)+'_blur')
    if not out_path.exists():
        out_path.mkdir()
    for file_name in p.rglob('*.png'):
        name = str(file_name).split("/")[-1]
        file_name = str(file_name)
        image = Image.open(file_name)
        image = image.convert(mode="RGB")
        print(image.size)
 
        if image.size[0]>2000 or image.size[1]>2000:
            blurred = image.filter(ImageFilter.GaussianBlur(radius = 24)) 
        elif image.size[0]>1000 or image.size[1]>1000:
            blurred = image.filter(ImageFilter.GaussianBlur(radius = 12)) 
        else:
            blurred = image.filter(ImageFilter.GaussianBlur(radius = 5)) 
        out = out_path.joinpath(name)
        blurred.save(str(out))
    for file_name in p.rglob('*.jpg'):
        name = str(file_name).split("\\")[-1]
        file_name = str(file_name)
        image = Image.open(file_name)
        image = image.convert(mode="RGB")
        print(image.size)
 
        if image.size[0]>2000 or image.size[1]>2000:
            blurred = image.filter(ImageFilter.GaussianBlur(radius = 24)) 
        elif image.size[0]>1000 or image.size[1]>1000:
            blurred = image.filter(ImageFilter.GaussianBlur(radius = 12)) 
        else:
            blurred = image.filter(ImageFilter.GaussianBlur(radius = 5)) 
        out = out_path.joinpath(name)
        blurred.save(str(out))
        