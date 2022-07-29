from django.shortcuts import render
import simplejson
# Create your views here.
from django.http import HttpResponse
from .models import Question

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt


def index(request):
    if request.method == 'POST':
        print(request.POST)
        req = simplejson.loads(request.body)
        print(req)
        QA_results = req['results']["outputs"]['qa_answers']
        reco_results = req['results']["outputs"]["re_answers"]
        timeing = req['results']["outputs"]["timing"]
        surveyData = req['results']["outputs"]["surveyData"]
        tasks = req['results']["outputs"]["tasks"]
        workerId = req['workerId']
        assId = req['assignmentId']
        Question.objects.create(QA_results = QA_results, reco_results = reco_results, timeing = timeing, surveyData = surveyData, tasks = tasks, workerId = workerId, assId = assId)
        return HttpResponse("receive")
    else:
        return HttpResponse("Hello, world. You're at the new3 index.")