# VisRecall: Quantifying Information Visualisation Recallability via Question Answering
[![Identifier](https://img.shields.io/badge/doi-10.18419%2Fdarus--2826-d45815.svg)](https://doi.org/10.18419/darus-2826)

*Yao Wang, Chuhan Jiao(Aalto University), Mihai Bâce and Andreas Bulling*

IEEE Transactions on Visualization and Computer Graphics (TVCG)

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

If you think this repository is useful to you, please consider citing our work as:

```
@ARTICLE{9855227,
  author={Wang, Yao and Jiao, Chuhan and B&#x00E2;ce, Mihai and Bulling, Andreas},
  journal={IEEE Transactions on Visualization and Computer Graphics}, 
  title={VisRecall: Quantifying Information Visualisation Recallability Via Question Answering}, 
  year={2022},
  volume={},
  number={},
  pages={1-12},
  doi={10.1109/TVCG.2022.3198163}}
```

contact: yao.wang@vis.uni-stuttgart.de
