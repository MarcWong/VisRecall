from cv2 import cv2
import numpy as np
import re,os
from glob import glob
from PIL import Image
import matplotlib.pyplot as plt
from shutil import rmtree
import pandas as pd
from natsort import natsorted
import imageio
import moviepy.editor as mp

bp = "E:/1Study/Hiwi/Massvis dataset" # change base path to the directory where you have downloaded the salicon data
curdir = 'E:/1Study/Hiwi/massvis/eyetracking/csv_files/fixationsByVis'
eledir = 'E:/1Study/Hiwi/massvis/dataset/csv_files/targets393_elementLabels/elementLabels/'
origimdir = os.path.join(bp, 'targets')

def highlight_function(x,y,r,imagePath,outPath,imgName):
    # load input image
    img= cv2.imread(imagePath, cv2.IMREAD_UNCHANGED)

    # blur the image_origin to imgBlur
    imgBlur=cv2.blur(img,(15,15))

    # reduce brightness of imgBlur by 40%
    w=imgBlur.shape[1]
    h=imgBlur.shape[0]

    imgBrightness=0.6

    for xi in range(0,w):
        for xj in range(0,h):
            imgBlur[xj,xi,0]=int(imgBlur[xj,xi,0]*imgBrightness)
            imgBlur[xj,xi,1]=int(imgBlur[xj,xi,1]*imgBrightness)
            imgBlur[xj,xi,2]=int(imgBlur[xj,xi,2]*imgBrightness)


    # get size of image
    height, width = img.shape[:2]
    height = int(height)
    width = int(width)

    # generate in-circle-display template
    circleIn = np.zeros((height, width, 1), np.uint8)
    circleIn = cv2.circle(circleIn, (x, y), r, (1), -1)

    # generate out-circle-display template
    circleOut = circleIn.copy()
    circleOut[circleOut == 0] = 2
    circleOut[circleOut == 1] = 0
    circleOut[circleOut == 2] = 1

    # generate imgIn in which only the content in the spotlight circle remains 
    # generate a blank img with the same size of input image 
    imgIn = np.zeros((height, width, 4), np.uint8)
    # copy first 3 channel
    imgIn[:, :, 0] = np.multiply(img[:, :, 0], circleIn[:, :, 0])
    imgIn[:, :, 1] = np.multiply(img[:, :, 1], circleIn[:, :, 0])
    imgIn[:, :, 2] = np.multiply(img[:, :, 2], circleIn[:, :, 0])
    # set non-transparent part of α channel
    circleIn[circleIn == 1] = 255
    imgIn[:, :, 3] = circleIn[:, :, 0]

    # generate imgOut in which only the content outside the spotlight circle remains and be blurred
    imgOut = np.zeros((height, width, 4), np.uint8)
    imgOut[:, :, 0] = np.multiply(imgBlur[:, :, 0], circleOut[:, :, 0])
    imgOut[:, :, 1] = np.multiply(imgBlur[:, :, 1], circleOut[:, :, 0])
    imgOut[:, :, 2] = np.multiply(imgBlur[:, :, 2], circleOut[:, :, 0])
    circleOut[circleOut == 1] = 255
    imgOut[:, :, 3] = circleOut[:, :, 0]

    # generate output image by adding imgIn and imgOut
    imgHighlight = cv2.add(imgIn,imgOut)
    cv2.imwrite(os.path.join(outPath , imgName+'.png'),imgHighlight)

    if(cv2.waitKey(0)==27): 
        cv2.destroyAllWindows()

    return imgHighlight


for curfile in os.listdir(curdir):
    os.makedirs(os.path.join(bp, 'highlight'), exist_ok=True)
    outpath = os.path.join(bp, 'highlight', curfile)
    os.makedirs(outpath, exist_ok=True)
    basepath = os.path.basename(curfile)
    imname, ext = os.path.splitext(basepath)
    print('imname',imname)
        
    allfiles = natsorted(glob(os.path.join(curdir, curfile, 'enc' ,'*.csv')))

    # get the experiment data (csv format) 
    for subcsv in allfiles:
        fixations = pd.read_csv(subcsv, header=None)
        x=[]
        y=[]
        duration=[]
        for row in fixations.iterrows():
            x.append(row[1][1])
            y.append(row[1][2])
            duration.append(row[1][3])

    gif_image=[]

    # generate spotlight gif image
    for i in range(len(x)):

        #adjust the duration parameter so that the spotlight circle won't be too large or too small to display
        dur = duration[i]/3 if duration[i]/3>100 else 100
        dur = dur if dur>100 else 100

        # Make the display time of each spotlight correspond to the observation time of the experimenter
        dur_int=int(duration[i]/50)
        for j in range(dur_int):
            gif_image.append(highlight_function(int(x[i]),int(y[i]),int(dur),os.path.join(origimdir, curfile+'.png'),outpath,imname+'('+str(i+1)+')') )
        print(i)

    # save spotlight gif image 
    imageio.mimsave(os.path.join(outpath,imname+'.gif'), gif_image, fps=100)

# problem!!! : The generated spotlight gif image is too large
# possible solution: convert gif format to webm format. Converting to webm format can significantly reduce the file size 

