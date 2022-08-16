# VisRecall: Quantifying Information Visualisation Recallability via Question Answering

*Yao Wang, Chuhan Jiao(Aalto University), Mihai Bâce and Andreas Bulling*

submitted to The IEEE Transactions on Visualization and Computer Graphics (TVCG2022)

This repository contains the dataset and models for predicting visualisation recallability.

```
$Root Directory
│
│─ README.md —— this file
│
|─ RecallNet —— Source code of the network to predict infovis recallability 
│  │
│  │─ environment.yaml —— conda environments
│  │
│  │─ notebooks 
│  │  │
│  │  │─ train_RecallNet.ipynb —— main notebook for training and validation
│  │  │
│  │  └─ massvis_recall.json —— saved recallability scores for MASSVIS dataset
│  │
│  └─ src
│     │
│     │─ singleduration_models.py —— RecallNet model
│     │
│     │─ sal_imp_utilities.py —— image processing utilities
│     │
│     │─ losses_keras2.py —— loss functions
│     │
│    ...
│
│
│─ WebInterface —— The Web interface for experiment, see WebInterface/README.md
│
│   
└─ VisRecall —— The dataset
   │
   │─ answer_raw —— raw answers from AMT workers
   │  
   │─ merged
   │  │
   │  │─ src —— original images
   │  │
   │  │─ qa —— question annotations
   │  │
   │  └─ image_annotation —— other metadata annotations
   │     
   └─ training_data
      │
      │─ all —— all averaged questions
      │
      └─ X-question —— a specific type of question (T-, FE-, F-, RV-, U-)
```


contact: yao.wang@vis.uni-stuttgart.de
