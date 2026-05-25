#!/usr/bin/env python
# coding: utf-8

# # INSURANCE CLAIM FRAUD DETECTION PROJECT

# In[3]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score


# In[4]:


import warnings
warnings.filterwarnings("ignore")


# In[5]:


#Imbalance Handling

from imblearn.over_sampling import SMOTE


# 

# In[6]:


#Models

from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from catboost import CatBoostClassifier


# In[7]:


#Evaluation Metrics

from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn.metrics import roc_auc_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report


# In[8]:


#Save Model

import joblib


# In[9]:


#LOAD DATASET
data = pd.read_csv('fraud_insurance_claims.csv')
data


# In[10]:


#Display first 5 rows

data.head()


# In[11]:


#Dataset Shape

print("Dataset Shape:", data.shape)


# In[12]:


#Dataset Information

print("\nDataset Info:\n")
print(data.info())


# In[13]:


data.describe


# In[14]:


print("\nMissing Values:\n")
print(data.isnull().sum())


# In[15]:


print("\nDuplicate Rows:", data.duplicated().sum())


# In[16]:


print("\nUnique Values:\n")
print(data.nunique())


# In[17]:


#identify coloumns types
print("\nColumn Data Types:\n")
print(data.dtypes)


# In[18]:


numerical_cols = data.select_dtypes(include=['int64', 'float64']).columns.tolist()


# In[19]:


categorical_cols = data.select_dtypes(include=['object']).columns.tolist()

print("\nNumerical Columns:\n", numerical_cols)
print("\nCategorical Columns:\n", categorical_cols)


# In[ ]:





# In[20]:


print("\nFraud Distribution:\n")
print(data['fraud_reported'].value_counts())


# In[21]:


plt.figure(figsize=(6,4))
sns.countplot(x='fraud_reported', data=data)
plt.title("Fraudulent vs Genuine Claims")
plt.show()


# In[22]:


plt.figure(figsize=(8,5))
sns.histplot(data['total_claim_amount'], bins=30, kde=True)
plt.title("Total Claim Amount Distribution")
plt.show()


# In[23]:


plt.figure(figsize=(8,5))
sns.boxplot(x='fraud_reported', y='total_claim_amount', data=data)
plt.title("Fraud vs Total Claim Amount")
plt.show()


# In[24]:


plt.figure(figsize=(8,5))
sns.countplot(x='incident_severity', data=data)
plt.xticks(rotation=45)
plt.title("Incident Severity Distribution")
plt.show()


# In[25]:


plt.figure(figsize=(10,5))
sns.countplot(x='collision_type', hue='fraud_reported', data=data)
plt.xticks(rotation=45)
plt.title("Collision Type vs Fraud")
plt.show()


# In[26]:


plt.figure(figsize=(12,5))
sns.countplot(x='auto_make', data=data)
plt.xticks(rotation=90)
plt.title("Vehicle Brand Distribution")
plt.show()


# In[27]:


plt.figure(figsize=(15,10))

numeric_df = data.select_dtypes(include=np.number)

sns.heatmap(numeric_df.corr(), cmap='coolwarm')

plt.title("Correlation Heatmap")
plt.show()


# In[28]:


data.drop_duplicates(inplace=True)


# In[29]:


#Numerical Columns

for col in numerical_cols:
  data[col].fillna(data[col].median(), inplace=True)


# In[30]:


#Categorical Columns

for col in categorical_cols:
 data[col].fillna(data[col].mode()[0], inplace=True)


# In[31]:


data.replace('?', np.nan, inplace=True)


# In[32]:


#feature engineering
data['policy_bind_date'] = pd.to_datetime(data['policy_bind_date'])
data['incident_date'] = pd.to_datetime(data['incident_date'])


# In[33]:


data['policy_duration_days'] = (
data['incident_date'] - data['policy_bind_date']
).dt.days


# In[34]:


current_year = 2025

data['vehicle_age'] = current_year - data['auto_year']


# In[35]:


data['claim_ratio'] = (
data['total_claim_amount'] / data['policy_annual_premium']
)


# In[36]:


data['injury_severity_score'] = (
data['injury_claim'] +
data['bodily_injuries'] * 1000
)


# In[37]:


data.drop(['policy_bind_date', 'incident_date'], axis=1, inplace=True)


# In[38]:


data['fraud_reported'] = data['fraud_reported'].map({'Y':1, 'N':0})


# In[39]:


X = data.drop('fraud_reported', axis=1)

y = data['fraud_reported']


# In[40]:


categorical_cols = data.select_dtypes(include=['object']).columns.tolist()

print(categorical_cols)


# In[41]:


data['fraud_reported'] = data['fraud_reported'].map({
    'Y': 1,
    'N': 0
})


# In[42]:


from sklearn.preprocessing import LabelEncoder

label_encoders = {}

for col in categorical_cols:

    if col != 'fraud_reported':

        le = LabelEncoder()

        data[col] = le.fit_transform(data[col].astype(str))

        label_encoders[col] = le


# In[43]:


print(data.dtypes)


# In[44]:


X = data.drop('fraud_reported', axis=1)

y = data['fraud_reported']


# In[45]:


# Preprocessing
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)
print("Scaling Completed Successfully!")


# In[46]:


X_scaled = pd.DataFrame(
    X_scaled,
    columns=X.columns
)

X_scaled.head()


# In[47]:


# Clean target column first

data['fraud_reported'] = (
    data['fraud_reported']
    .astype(str)
    .str.strip()
    .str.upper()
)

# Convert target values
data['fraud_reported'] = data['fraud_reported'].map({
    'Y': 1,
    'N': 0
})

# Check for missing values
print(data['fraud_reported'].isnull().sum())

# Display target distribution
print(data['fraud_reported'].value_counts())


# In[48]:


print(data['fraud_reported'].unique())


# In[ ]:





# In[49]:


import pandas as pd

df = pd.read_csv("fraud_insurance_claims.csv")


# In[50]:


print(df['fraud_reported'].unique())


# In[51]:


df['fraud_reported'] = df['fraud_reported'].replace({
    'Y': 1,
    'N': 0
})


# In[52]:


print(df['fraud_reported'].value_counts())

print(df['fraud_reported'].isnull().sum())


# In[53]:


categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

# Remove target column if present
if 'fraud_reported' in categorical_cols:
    categorical_cols.remove('fraud_reported')

print(categorical_cols)


# In[54]:


from sklearn.preprocessing import LabelEncoder

label_encoders = {}

for col in categorical_cols:

    le = LabelEncoder()

    df[col] = le.fit_transform(df[col].astype(str))

    label_encoders[col] = le


# In[55]:


df['policy_bind_date'] = pd.to_datetime(df['policy_bind_date'])

df['incident_date'] = pd.to_datetime(df['incident_date'])

# Feature Engineering
df['policy_duration_days'] = (
    df['incident_date'] - df['policy_bind_date']
).dt.days

# Drop original date columns
df.drop(['policy_bind_date', 'incident_date'], axis=1, inplace=True)


# In[56]:


X = df.drop('fraud_reported', axis=1)

y = df['fraud_reported']


# In[57]:


from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

X_scaled = pd.DataFrame(X_scaled, columns=X.columns)

print("Scaling Completed Successfully!")


# In[58]:


from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Train Shape:", X_train.shape)
print("Test Shape:", X_test.shape)


# In[67]:


# Save Training Columns

training_columns = X.columns.tolist()

joblib.dump(
    training_columns,
    "training_columns.pkl"
)

print("Training Columns Saved!")


# In[59]:


# ============================================
# Apply SMOTE for Class Balancing
# ============================================

from imblearn.over_sampling import SMOTE

print("Before SMOTE:")
print(y_train.value_counts())

smote = SMOTE(random_state=42)

X_train_smote, y_train_smote = smote.fit_resample(
    X_train,
    y_train
)

print("\nAfter SMOTE:")
print(pd.Series(y_train_smote).value_counts())


# In[60]:


# ============================================
# RANDOM FOREST MODEL
# ============================================

from sklearn.ensemble import RandomForestClassifier

rf_model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

rf_model.fit(X_train_smote, y_train_smote)

print("Random Forest Model Trained Successfully!")


# In[61]:


# ============================================
# RANDOM FOREST PREDICTION
# ============================================

rf_pred = rf_model.predict(X_test)

rf_prob = rf_model.predict_proba(X_test)[:,1]


# In[62]:


# ============================================
# RANDOM FOREST EVALUATION
# ============================================

from sklearn.metrics import accuracy_score
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn.metrics import roc_auc_score
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

print("Random Forest Accuracy:",
      accuracy_score(y_test, rf_pred))

print("Random Forest Precision:",
      precision_score(y_test, rf_pred))

print("Random Forest Recall:",
      recall_score(y_test, rf_pred))

print("Random Forest F1 Score:",
      f1_score(y_test, rf_pred))

print("Random Forest ROC AUC:",
      roc_auc_score(y_test, rf_prob))

print("\nClassification Report:\n")

print(classification_report(y_test, rf_pred))


# In[63]:


# ============================================
# RANDOM FOREST CONFUSION MATRIX
# ============================================

cm = confusion_matrix(y_test, rf_pred)

plt.figure(figsize=(5,4))

sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    cmap='Blues'
)

plt.title("Random Forest Confusion Matrix")

plt.xlabel("Predicted")

plt.ylabel("Actual")

plt.show()


# In[64]:


# ============================================
# HANDLE CLASS IMBALANCE USING SMOTE
# ============================================

from imblearn.over_sampling import SMOTE

print("Before SMOTE:")
print(y_train.value_counts())

smote = SMOTE(random_state=42)

X_train_smote, y_train_smote = smote.fit_resample(
    X_train,
    y_train
)

print("\nAfter SMOTE:")
print(pd.Series(y_train_smote).value_counts())


# In[65]:


# ============================================
# XGBOOST MODEL
# ============================================

from xgboost import XGBClassifier

xgb_model = XGBClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=6,
    random_state=42
)

xgb_model.fit(X_train_smote, y_train_smote)

print("XGBoost Model Trained Successfully!")


# In[66]:


# ============================================
# SAVE MODEL FILES
# ============================================

import joblib

joblib.dump(
    xgb_model,
    "xgboost_fraud_model.pkl"
)

joblib.dump(
    scaler,
    "scaler.pkl"
)

joblib.dump(
    label_encoders,
    "label_encoders.pkl"
)

print("PKL Files Saved Successfully!")


# In[ ]:




