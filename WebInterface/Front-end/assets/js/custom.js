/* UI Parameters *******************************************************************/

const PARAMS = {
    ENABLE_MSEC_SET_URL: false, // enables setting image display time in the url like so: '?msecImg=1000'
    NUM_MSEC_CROSS: 750, // how long the fixation cross is shown for
    NUM_MSEC_IMAGE: 20000, // num milliseconds to show each image for
    NUM_MSEC_SENTINEL: 750, // how long a sentinel image is shown for
    NUM_MSEC_CHAR: 400, // how long the code chart is shown

    IMG_WIDTH: 1600, // max img width
    IMG_HEIGHT: 800, // max img height

    N_BUCKETS: 1,
    N_SUBJ_FILES: 1,

    MAX_INVALID_ALLOWED_TUTORIAL: 1,
    MAX_INCORRECT_SENTINELS_ALLOWED_TUTORIAL: 0,

    GIVE_FEEDBACK: true, // should feedback be given during the tutorial
    NUM_MSEC_FEEDBACK: 2000, // how long does the feedback stay on the screen
}

// messages shown if feedback is given
const POSITIVE_MESSAGE = "Keep up the good work!";
const NEGATIVE_MESSAGE = "Please type the triplet you see when the image vanishes.";

// path to the task data to use
const DATA_BASE_PATH = "assets/task_data/";
// base path relative to which image paths are defined
const IMAGE_BASE_PATH = "assets/"
const SUBJECT_FILES_BASE_PATH = DATA_BASE_PATH + "full_subject_files/";
const FIXATION_CROSS = DATA_BASE_PATH + "fixation-cross.jpg"
const TARGET_NUM = 40

/* Global vars **********************************************************************/

// variables we want to save to store to outputs
var SUBJ_ID;
var BUCKET_NUM;
var SUBJ_FILE_PATH;
var OPEN_TIME; // when the url is first loaded
var START_TIME; // when they first click the "continue" button
var LOAD_TIME; // when the last image loads and the task is ready to go

// normal images
var IMAGES = new Array(); // preload the images

var CHECKED_TUTORIAL_FLAG = false;
var IS_TUTORIAL = true;
var MESSAGE = "";
var MESSAGE_IS_POSITIVE = true;

// during the task, keeps track of how the participant is doing
// this count is only valid up until you hit the submit button
var SCORES = {
    SENTINEL_CORRECT: 0,
    SENTINEL_TOTAL: 0,
    IMAGE_CORRECT: 0,
    IMAGE_TOTAL: 0,
    INVALID: 0
}

// The answers picked by user
var ANSWERS = []
var ANSWER_TMP = []
var RECO_ANSWERS = []


/* End vars ************************************************************/

var custom = {
    loadTasks: function() {

        /*
         * Loads data needed to run the task and does some one-time setup, such as:
         *  - timestamping the start of the task
         *  - selecting a subject file to use and loading it
         *  - preloading images
         *
         * returns [obj, int]: A length-two list where the first element is the loaded task data
         *  and the second element is the number of trails (number of images) in the task.
         */

        OPEN_TIME = new Date();
        DEBUG = gup("debug") == "true";

        $(".instruction-button").click(function() {
            START_TIME = new Date();
            $(this).unbind();
        })

        //hide all subtasks to begin with
        $(".subtask").hide();

        // set the size of the images
        $("img.img-main").css({
            "width": "100%",
            "height": "100%",
            "objectFit": "contain"
        });
        $("img.img-blur").css({
            "width": "100%",
            "height": "100%",
            "objectFit": "contain"
        });

        BUCKET_NUM = gupOrRandom("bucket", PARAMS.N_BUCKETS);
        SUBJ_ID = gupOrRandom("subj", PARAMS.N_SUBJ_FILES);
        console.log("Bucket", BUCKET_NUM, "subjId", SUBJ_ID);
        SUBJ_FILE_PATH = SUBJECT_FILES_BASE_PATH + "bucket" + BUCKET_NUM + "/subject_file_" + SUBJ_ID + ".json";

        return $.get(SUBJ_FILE_PATH).then(function(tasks) {
            console.log(tasks)
                /*if (DEBUG) {
                  if (tasks.length > 1) {
                    tasks = tasks.slice(0, 1);
                  }
                }*/
                // pre-load all the images
            preloadImages(tasks);

            // set the correct image exposure
            if (PARAMS.ENABLE_MSEC_SET_URL) {
                var urlMsecImg = gup('msecImg');
                if (urlMsecImg.length > 0) {
                    PARAMS.NUM_MSEC_IMAGE = parseInt(urlMsecImg);
                }
            }

            console.log("Trial start:", new Date());
            console.log("Image exposure time:", PARAMS.NUM_MSEC_IMAGE);
            console.log("CC exposure time:", PARAMS.NUM_MSEC_CHAR);
            console.log("S exposure time:", PARAMS.NUM_MSEC_SENTINEL);

            return [tasks, tasks.length];
        });

    },

    showTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * Shows the next trial of the experiment (fix cross, image, code chart, and character input.)
         *
         * taskInput - the task data returned from loadTasks
         * taskIndex - the number of the current subtask (image)
         * taskOutput - a partially filled out object containing the results (so far) of the task.
         *
         * returns: None
         */
        var nMsecFeedback = (PARAMS.GIVE_FEEDBACK && MESSAGE && IS_TUTORIAL) ? PARAMS.NUM_MSEC_FEEDBACK : 0;
        var messageClass = MESSAGE_IS_POSITIVE ? "positive" : "negative";

        // terminate task early if they do not have required performance on tutorial
        IS_TUTORIAL = isTutorial(taskInput[taskIndex]);
        if (IS_TUTORIAL || didEndTutorial(taskInput, taskIndex, taskOutput)) {
            if (!passedTutorial()) {
                return;
            }
        }

        $(".subtask").hide();
        $('#next-button').hide(); // Hide the next button; we will handle control flow for this task
        $('#qa-button').hide();
        $('#nq-button').hide();
        $("#reco-button").hide();

        hideIfNotAccepted();

        if (nMsecFeedback > 0) {
            var feedbackMessageElt = $("#feedback-message");
            feedbackMessageElt.empty();
            feedbackMessageElt.append('<div class="ui message ' + messageClass + '"><div class="header">' + MESSAGE + '</div></div>');
            $("#feedback-subtask").show();
        }
        setTimeout(showFixationCross.bind(this, taskInput, taskIndex, taskOutput), nMsecFeedback);

    },

    collectData: function(taskInput, taskIndex, taskOutput) {
        /*
         * Records the experimental output for the current subtask (image).
         *
         * taskInput - the task data returned from loadTasks
         * taskIndex - the number of the current subtask (image)
         * taskOutput - a partially filled out object containing the results (so far) of the task.
         *
         * returns: the new taskOutput object containing the data for the current subtask.
         */
        var rememberedCode = $("#remembered-char").val().toUpperCase();
        var isValidCode = _includes(taskInput[taskIndex].codes, rememberedCode);
        //var isValidCode = _isCodePresent(rememberedCode, taskInput[taskIndex].codes);
        var coord = isValidCode ? taskInput[taskIndex].coordinates[rememberedCode] : false;

        taskOutput[taskIndex] = {
            rememberedCode: rememberedCode,
            isValidCode: isValidCode,
            coordinate: coord
        };


        return taskOutput;
    },

    validateTask: function(taskInput, taskIndex, taskOutput) {
        /*
         * Reports whether the data corresponding to the current
         * subtask (image) is valid (e.g. fully filled out)
         *
         * taskInput - the task data returned from loadTasks
         * taskIndex - the number of the current subtask (image)
         * taskOutput - a partially filled out object containing the results (so far) of the task.
         *
         * returns: falsey value if validation passed for the taskIndex-th subjtask.
         *  Truthy value if validation failed. To display a specific error message,
         *  return an object of the form {errorMessage: ""}
         */

        // Answer rejection
        /*if(ANSWERS.length>=5){
          for(var i = 0; i < ANSWERS.length-5; i++) {
            if(ANSWERS[i]==ANSWERS[i+1]&ANSWERS[i]==ANSWERS[i+3]&ANSWERS[i]==ANSWERS[i+2]&ANSWERS[i]==ANSWERS[i+4]){
                return {errorMessage: "Sorry, you are not allowed to continue."};
              }
          }
        }*/

        // keep track of scores
        var validCode = taskOutput[taskIndex].isValidCode;
        SCORES.INVALID += !validCode;
        var correctTrial;
        if (isSentinel(taskInput[taskIndex])) {
            SCORES.SENTINEL_TOTAL += 1;
            var codeEntered = taskOutput[taskIndex].rememberedCode;
            var correctCodes = taskInput[taskIndex].correct_codes;
            if (!correctCodes) throw new Error("Correct codes were not provided in the subject file!");
            var gotSentinel = _includes(correctCodes, codeEntered);
            SCORES.SENTINEL_CORRECT += gotSentinel;
            correctTrial = gotSentinel;
        } else {
            SCORES.IMAGE_TOTAL += 1;
            SCORES.IMAGE_CORRECT += validCode;
            correctTrial = validCode;
        }
        MESSAGE = correctTrial ? POSITIVE_MESSAGE : NEGATIVE_MESSAGE;
        MESSAGE_IS_POSITIVE = correctTrial;
        console.log('Invalid scores answered so far:', SCORES.INVALID);

        return false; // we'll allow the task to continue either way but we'll remember if an invalid code was entered
    },

    getUploadPayload: function(taskOutputs) {
        /*
         * Returns the final output object to be saved from the task.
         *
         * taskInput - the task data returned from loadTasks
         * taskOutput - a fully filled out object containing the results of the task.
         *
         * returns: all the data you want to be stored from the task.
         */

        var endTime = new Date();

        // compile timing data
        var timing = {
            openTime: OPEN_TIME,
            loadTime: LOAD_TIME,
            startTime: START_TIME,
            endTime: endTime,
            timeToCompleteFromOpenMsec: endTime - OPEN_TIME,
            timeToLoadMsec: LOAD_TIME - OPEN_TIME,
            timeToCompleteFromStartMsec: endTime - START_TIME
        }

        // put the survey data under a separate key
        var surveyData = taskOutputs.survey_data;
        delete taskOutputs.survey_data;

        // task outputs to store, including timing data
        var new_taskoutputs = {};
        for (var i = 0; i < TARGET_NUM; i++) {
            new_taskoutputs[i] = taskOutputs[i];
        }
        var outputs = {
            timing: timing,
            surveyData: surveyData,
            tasks: new_taskoutputs,
            qa_answers: ANSWERS,
            re_answers: RECO_ANSWERS
        }

        return {
            'outputs': outputs
        }

    },

    getPayload: function(taskInputs, taskOutputs) {
        /*
         * Returns the final output object to be saved from the task.
         *
         * taskInput - the task data returned from loadTasks
         * taskOutput - a fully filled out object containing the results of the task.
         *
         * returns: all the data you want to be stored from the task.
         */

        // delete codes and coordinates from taskInputs to save space
        taskInputs.forEach(function(elt, i) {
            delete elt.codes;
            delete elt.coordinates;
        })

        // task inputs to store, including parameters used
        var inputs = {
            params: PARAMS,
            tasks: taskInputs,
            subjId: SUBJ_ID,
            bucketNum: BUCKET_NUM,
            subjFilePath: SUBJ_FILE_PATH
        }

        var endTime = new Date();

        // compile timing data
        var timing = {
            openTime: OPEN_TIME,
            loadTime: LOAD_TIME,
            startTime: START_TIME,
            endTime: endTime,
            timeToCompleteFromOpenMsec: endTime - OPEN_TIME,
            timeToLoadMsec: LOAD_TIME - OPEN_TIME,
            timeToCompleteFromStartMsec: endTime - START_TIME
        }

        // put the survey data under a separate key
        var surveyData = taskOutputs.survey_data;
        delete taskOutputs.survey_data;

        // task outputs to store, including timing data
        var new_taskoutputs = {};
        for (var i = 0; i < TARGET_NUM; i++) {
            new_taskoutputs[i] = taskOutputs[i];
        }
        var outputs = {
            timing: timing,
            surveyData: surveyData,
            tasks: new_taskoutputs,
            qa_answers: ANSWERS,
            re_answers: RECO_ANSWERS
        }

        return {
            'inputs': inputs,
            'outputs': outputs
        }

    },
    updateAnswers: function(qa_counter) {
        if (qa_counter == 1) {
            ANSWER_TMP = [];
        }
        console.log(ANSWER_TMP);
        var ans = $('input:radio[name="answer"]:checked').val();
        console.log(ans);
        ANSWER_TMP.push(ans);
        if (qa_counter == 5) {
            ANSWERS = ANSWER_TMP;
        }
    },

    recoAnswers: function() {
        console.log(RECO_ANSWERS);
        var ans = $('input:radio[name="re-answer"]:checked').val();
        console.log(ans);
        if (ans == "1" || ans == "2") {
            RECO_ANSWERS.push(ans);
        }
    }
};

function passedTutorial() {
    /* Returns false if the subject has failed the tutorial, else true.*/
    var failedValidCheck = SCORES.INVALID > PARAMS.MAX_INVALID_ALLOWED_TUTORIAL;
    var failedSentinelCheck = (SCORES.SENTINEL_TOTAL - SCORES.SENTINEL_CORRECT) > PARAMS.MAX_INCORRECT_SENTINELS_ALLOWED_TUTORIAL;
    // check accuracy
    if (failedValidCheck || failedSentinelCheck) {
        $('.subtask').hide();
        $('#next-button').hide();
        $('#qa-button').hide();
        $('#nq-button').hide();
        $("#reco-button").hide();
        $("#accuracy-error-message").show();
        return false;
    }
    return true;
}

function showFixationCross(taskInput, taskIndex, taskOutput) {
    /* Displays the fixation cross on the screen and queues the next target image. */
    $('.subtask').hide();
    $("#show-cross-subtask").show();
    setTimeout(showImage.bind(this, taskInput, taskIndex, taskOutput), PARAMS.NUM_MSEC_CROSS);
}

function showImage(taskInput, taskIndex, taskOutput) {
    /* Displays a target image on the screen and queues the corresponding code chart. */
    console.log(taskIndex);
    //console.log(ANSWERS);
    $('#recall-subtask').hide();
    $('.subtask').hide();
    var imgFile = IMAGES[taskIndex].src;
    if (!imgFile.includes('blur')) {
        $("#img-blur-box").hide();
        $("#img-main-box").show();
        $("#img-main").attr("src", imgFile);
    } else {
        $("#img-blur-box").show();
        $("#img-main-box").hide();
        $("#img-blur").attr("src", imgFile);
    }

    $("#show-image-subtask").show();

    var nSecs = isSentinel(taskInput[taskIndex]) ? PARAMS.NUM_MSEC_SENTINEL : PARAMS.NUM_MSEC_IMAGE;
    if (taskIndex < TARGET_NUM) {
        if (taskIndex === TARGET_NUM - 1) {
            PARAMS.NUM_MSEC_IMAGE = 2000; //for recall stage
        }
        if (!imgFile.includes('blur'))
            setTimeout(function() {
                $(".subtask").hide();
                $("#next-button").show()
            }, nSecs);
        // load QA
        else {
            $('#question-answer-subtask').show();
            $('#qa-button').hide();
            $('#next-button').hide();
            $("#reco-button").hide();
            $('#show-image-subtask').show();
            $('#nq-button').show();

            $('#question').html(taskInput[taskIndex].QA.Q1.question);
            $('label[for=A]').html(taskInput[taskIndex].QA.Q1.A);
            $('label[for=B]').html(taskInput[taskIndex].QA.Q1.B);
            $('label[for=C]').html(taskInput[taskIndex].QA.Q1.C);
        }
    } else {
        setTimeout(function() { recall_QA(taskInput, taskIndex, taskOutput); }, PARAMS.NUM_MSEC_IMAGE);
    }
}

function recall_QA(taskInput, taskIndex, taskOutput) {
    console.log("Recall_QA start");

    $('#question-answer-subtask').hide();
    $('#qa-button').hide();
    $('#show-image-subtask').hide();
    $('#nq-button').hide();
    $('#next-button').show();
    $('#recall-subtask').show();
    custom.recoAnswers();
}

function preloadImages(data) {
    /*
     * Loads all images for the task so they are ready to go when the user starts.
     *
     * Shows a progress bar and disables the button to start the task until all
     * images are loaded.
     *
     * data: task data loaded from a subject file.
     */
    var continueButton = $(".instruction-button");
    _disable(continueButton);

    var cross = new Image(); // fixation cross image

    // populates arrays to store the Image elements
    data.forEach(function(elt, i) {
        IMAGES.push(new Image());
    });


    // callback for when all images have loaded
    var imLoadCallback = function() {
            console.log("done loading");
            _enable(continueButton);

            // Once you have loaded the images and know the size, set the correct display dimensions.
            // Assumes all images have the same height/width
            var shouldConstrainHeight = IMAGES[0].height / IMAGES[0].width > PARAMS.IMG_HEIGHT / PARAMS.IMG_WIDTH;
            if (shouldConstrainHeight) {
                $(".img-box").height(PARAMS.IMG_HEIGHT);
            } else {
                $(".img-box").width(PARAMS.IMG_WIDTH);
            }
            $(".img-blur-box").height(PARAMS.IMG_HEIGHT / 2);
        }
        // callback for every time a single image loads
    var imProgressCallback = function(imsLoaded, totalImsToLoad) {
        $("#im-load-progress").progress({ 'percent': imsLoaded / totalImsToLoad * 100 })
    }
    onAllImagesLoaded(IMAGES.concat([cross]), imProgressCallback, imLoadCallback);

    // start images loading
    cross.src = FIXATION_CROSS;
    $("#img-cross").attr("src", FIXATION_CROSS);
    data.forEach(function(elt, i) {
        IMAGES[i].src = IMAGE_BASE_PATH + elt.image;
    });
}

function gupOrRandom(name, num) {
    /* Returns the value for the key `name` in the querystring if it exists,
     * else an int n s.t. 0 <= n < num. */
    var qs = gup(name);
    return qs.length > 0 ? parseInt(qs) : Math.floor(Math.random() * num);
}

function gup(name) {
    /* Searches for a querystring with key name. Returns the value or "". */
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var tmpURL = window.location.href;
    var results = regex.exec(tmpURL);
    if (results == null) return "";
    else return results[1];
}

function clickButtonOnEnter(inputElt, buttonToClick) {
    /* Set up a binding between the enter key and a specific button.
     *
     * If the user enters the enter key into `inputElt`, `buttonToClick`
     * will be clicked.
     */
    inputElt.unbind();
    inputElt.focus();

    // wait a little bit before re-adding the callback, otherwise
    // the callback could fire twice
    setTimeout(function() {
        inputElt.keyup(function(event) {
            if (event.keyCode === 13) { // 13 is the enter key
                buttonToClick.click();
            }
        });
    }, 500);
}

function onAllImagesLoaded(imgs, progressCallback, callback) {
    /*
     * Registers callbacks for when certain images are fully and partially loaded.
     *
     * This must be called BEFORE setting the `src` elements on imgs are set,
     * else the callback could be lost.
     *
     * imgs: an array of Image objects to watch. They should not have already started
     * loading, i.e. the `src` attribute should not yet be set.
     * progressCallback: Callback to be called every time an image loads. Takes two args:
     * the first is the number of images that have already loaded, the second is the total
     * number of images that will be loaded.
     * callback: Callback to be called when all images are loaded. Takes no args.
     *
     * returns: null
     */
    var imsToLoad = imgs.length;
    var numImsLoaded = 0;

    var incrementProgress = function() {
        numImsLoaded++;
        progressCallback(numImsLoaded, imsToLoad);
        if (numImsLoaded == imsToLoad) {
            callback();
            LOAD_TIME = new Date();
            console.log("Time to load secs", (LOAD_TIME - OPEN_TIME) / 1000)
        }
    }

    var successHandler = function() {
        console.log("loaded an image");
        incrementProgress();
    }

    var errorHandler = function(event) {
        console.log("Error!");
    }

    imgs.forEach(function(elt, i) {
        elt.onload = successHandler;
        elt.onerror = errorHandler;
    })
}

function _includes(arr, elt) {
    /* Checks if array `arr` contains element `elt`. */
    var idx = $.inArray(elt, arr);
    return idx != -1;
}

function _disable(button) {
    /* Disables button `button`. */
    button.addClass('disabled');
}

function _enable(button) {
    /* Enables button `button`. */
    button.removeClass('disabled');
}

function isTutorial(subtask) {
    /* Checks if `subtask` is part of the tutorial or not. */
    return subtask.flag == "tutorial_real" || subtask.flag == "tutorial_sentinel";
}

function didEndTutorial(taskInput, taskIndex, taskOutput) {
    /* Checks if the tutorial just finished. */
    return !isTutorial(taskInput[taskIndex]) && (taskIndex > 0 ? isTutorial(taskInput[taskIndex - 1]) : true);
}

function isSentinel(subtask) {
    /* Checks if this subtask corresponds to a sentinel image. */
    return subtask.flag == "tutorial_sentinel" || subtask.flag == "sentinel";
}