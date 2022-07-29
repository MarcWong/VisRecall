from django.db import models


class Question(models.Model):
    ID = models.IntegerField(primary_key=True)
    QA_results = models.CharField(max_length=20000)
    reco_results = models.CharField(max_length=20000)
    timeing = models.CharField(max_length=20000)
    surveyData = models.CharField(max_length=20000)
    tasks = models.CharField(max_length=20000)
    workerId = models.CharField(max_length=20000)
    assId = models.CharField(max_length=20000)
    def __str__(self):
        return self.ID


