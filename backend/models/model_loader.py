import joblib

# Load Model
model = joblib.load(
    "saved_models/xgboost_fraud_model.pkl"
)

# Load Scaler
scaler = joblib.load(
    "saved_models/scaler.pkl"
)

# Load Encoders
label_encoders = joblib.load(
    "saved_models/label_encoders.pkl"
)

# Load Training Columns
training_columns = joblib.load(
    "saved_models/training_columns.pkl"
)