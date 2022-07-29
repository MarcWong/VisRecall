## Progress Report from Luwei (May 2021)

* A new page is added after each CodeCharts task, in which the image of the current task will be shown again. The participant will be asked to answer a question about this image. (see new function QuestionAnswerEntry in `js/custom.js`)
* A new subtask named "question-answer-subtask" is added in `index.html`, in which you can customize the rules of input for the question and answer fields.
* The "Next" button in digit-input-page is now moved to the question-answer-page(name: next-button). And the button in digit-input-page is renamed "confirm"(name: qa-button). The new "Next" button in every task needs to add logic to check if the input complies with the input-rules.
* The question and answer input of the participant is now added to TaskInput. You can see this in CollectData function in `js/custom.js`
* A new script named `generate_spotlight` is added in `generate-experiment-files`. The basic function of this script is to generate a GIF image based on previous experiment data of Massvis dataset. This script visualizes the saliency coordinates and duration of each target image. A spotlight image is generated with the saliency coordinate as the center of the spotlight, and the radius of the spotligt is proportional to the duration. Then all the spotlight images of the same target image will be synthesized to a spotlight gif. In the spotlight gif, the duration of each spotlight image is proportional to the duration in the experiment data.

* **Things not finished so far:**
    * To launch this project as the Mturk Human Intelligent Task and collect data
    * To set the rules of question-answer-input. Actually we decide to generate the questions ourselves and let participant simply input the    answer. So basically just set the answer-input-rules
    * To generate questions of each image in Massvis Dataset(probably 5 question per image) and deploy the questions to every corresponding task of
   this project, so that the participant can simply answer the questions and we collect the answer-data.
    * To add a spotlight-gif of each image before each task starts. The script of generating spotlight-gif can be found in `generate-experiment-files/generate_spotlight`
* Also there is another launching option instead of Mturk, which is to launch this project in LimeSurvey. (yet we prefer to use Mturk because the functions in LimeSurvey are quite limited). You can find the project following this link: https://survey.perceptualui.org/index.php/admin/index . The project name is "Codecharts Saliency Tasks" by Luwei.
