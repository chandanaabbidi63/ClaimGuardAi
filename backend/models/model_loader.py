import os
import joblib

# Determine absolute path to saved_models directory relative to this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
saved_models_dir = os.path.join(BASE_DIR, "saved_models")

# Load Model
model = joblib.load(
    os.path.join(saved_models_dir, "xgboost_fraud_model.pkl")
)

# Load Scaler
scaler = joblib.load(
    os.path.join(saved_models_dir, "scaler.pkl")
)

# Load Encoders
label_encoders = joblib.load(
    os.path.join(saved_models_dir, "label_encoders.pkl")
)

# Load Training Columns
training_columns = joblib.load(
    os.path.join(saved_models_dir, "training_columns.pkl")
)