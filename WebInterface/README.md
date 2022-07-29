# VisRecall

A web based application to collect recallability scores under question-answering. It can be deployed in both crowd-sourcing and offline lab scenarios.

This is the supportive toolbox for the submission:

> Yao, W., Chuhan, J., Mihai, B., Andreas, B. [VisRecall: Quantifying Information Visualisation Recallability via Question Answering](https://git.hcics.simtech.uni-stuttgart.de/submissions/tvcg2022_yao) submitted to The IEEE Transactions on Visualization and Computer Graphics (TVCG2022).

## Getting started

1. Clone this repository to your working directory.
2. All the experimental files have been pre-generated for a sample task in [Front-end/assets/task_data](Front-end/assets/task_data).
3. To test the web interface with this sample task, change to the `Front-end` directory where the index.html file is located, and run a local http server of your choice, i.e., run this command in your terminal:

`python3 -m http.server 8000`

4. Take your web browser to http://localhost:8000/ and try the task!
5. Configure essential envs and run the Django project to receive the requests from the web interface:

`python3 Back-end/mysite/manage.py runserver`

6. Use Nginx and uwsgi for deployment!

## Testing on your own data

Using the interface for your own data collection requires two steps: 1) generating input data to the interface and 2) configuring the webpage to your needs. 

### Generating input data

The iPython notebook at [Front-end/generate-experiment-files/main.ipynb](Front-end/generate-experiment-files/main.ipynb) will walk you step-by-step through generating the experiment files required to run the interface with a new set of images. You will:
- provide a directory of images on which you wish to collect attention data
- customize the experimental design by choosing tutorial and sentinel images, the experiment length, and the number of subject files to generate 
- output your experiment files to [Front-end/assets/task_data](Front-end/assets/task_data). Once this is done, you can test your experiment by repeating step 2 (from "Getting started").

### Configuring the webpage

Configure the interface to your needs as follows: 

1. Open the file `assets/js/custom.js`. This is the principal JavaScript file responsable for the interface logic. At the top of the file there is a section labeled "UI Parameters" that contains configurable parameters that change how the task runs. Change the variables `N_BUCKETS` and `N_SUBJ_FILES` to match the number of buckets and subject files, respectively, that you generated above. To make sure the JavaScript can find your input data, either ensure that your data is in the file `assets/task_data` or change the variables `DATA_BASE_PATH` and `IMAGE_BASE_PATH`. 
2. Change the variables `NUM_MSEC_CROSS`, `NUM_MSEC_IMAGE`, `NUM_MSEC_SENTINEL`, and `NUM_MSEC_CHAR` to change how long the fixation cross, target images, sentinel images, and codecharts are shown to the participant. Adjust any other variables in the "UI Parameters" section that you desire.
3. Edit the file `config.json` to customize the task title, instructions, and disclaimer. You can also set the boolean `advanced.includeDemographicSurvey` to include a demographic survey at the end of the task, and you can set `advanced.hideIfNotAccepted` to block continuing with the task if it is on MTurk and the worker has not accepted the task. 
4. Decide how you want to store the collected task data. 
  * **Option 1: host your own data storage.** You can configure the interface to post the collected data to an API endpoint of your choice. The API should save the posted data and return a unique key that can be used to identify the data submitted. More specifically, the url should save JSON data submitted via a `POST` request and return a JSON response of the form `{"key": <submission_code>}`. The submission code will be displayed to the user as proof of task completion (for instance, so that the user can enter the submission code back to an MTurk task).
  * **Option 2: use MTurk (Untested).** This code base works out-of-the-box as an MTurk `ExternalQuestion`. Post this repository with your generated task data to a public url and point your MTurk task to that url. (For an example of how to launch a HIT on MTurk, see [the original example MTurk notebook from MIT's group](https://github.com/a-newman/mturk-template/blob/master/mturk/mturk.ipynb).)

## Code Map

```
$Root Directory
│
│─ `README.md` —— this file
│
|─ `Front-end` —— webApp
│  │
│  │─ `config.json`  —— configuration files containing general task-setup parameters
│  │
│  │─ `index.html` —— main html file for the webApp
│  │
│  │─ `assets/` —— contains JavaScript files and input data for the webApp as well as some additional libraries and assets. Important files detailed below: 
│  │  │
│  │  │─ `js/custom.js` —— JS file containing all study-specific functions. Most changes you need to make should be in this file.
│  │  │
│  │  │─ `js/main.js` —— Generic file handling task flow, data submission, etc. It does not contain study-specific functions
│  │  │
│  │  └─ `task_data` —— default folder for storing task input data.
│  │
│  │─ generate-experiment-files —— contains Python code for generating the data required to run the experiment 
│  │  │
│  │  └─ `main.ipynb` —— a Jupyter notebook that walks you through the steps of generating the task data 
│  │
│ ...
│   
│
└─ Back-end —— server project to saving data
   │
   └─ mysite
      │
      │─ uwsgi.ini.default —— uwsgi deployment configuration, change to uwsgi.ini to use
      │
      │─ manage.py —— script to run the project
      │
      │─ mysite —— general scripts of global router, settings, etc.
      │  │
      │  │─ settings.py —— Django general configuration
      │  │
      │  │─ urls.py —— url router
      │  │
      │ ... 
      │
      └─ polls —— apis handling the requests from the web interface
         │
         │─ models.py —— definition of model
         │
         │─ views.py —— definition of view
         │
        ...
```

contact: `yao.wang@vis.uni-stuttgart.de`
