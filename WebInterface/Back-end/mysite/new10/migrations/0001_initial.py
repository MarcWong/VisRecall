# Generated by Django 3.2.6 on 2021-08-16 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('ID', models.IntegerField(primary_key=True, serialize=False)),
                ('QA_results', models.CharField(max_length=20000)),
                ('reco_results', models.CharField(max_length=20000)),
                ('timeing', models.CharField(max_length=20000)),
                ('surveyData', models.CharField(max_length=20000)),
                ('tasks', models.CharField(max_length=20000)),
                ('workerId', models.CharField(max_length=20000)),
                ('assId', models.CharField(max_length=20000)),
            ],
        ),
    ]
