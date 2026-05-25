from fastapi import APIRouter
from models.schema import InsuranceClaimInput
from services.prediction_service import predict_fraud
from services.history import add_history_record

router = APIRouter()

@router.post("/predict")
def predict(data: InsuranceClaimInput):
    raw_data = data.dict()
    result = predict_fraud(raw_data)
    
    # Log to history
    add_history_record(raw_data, result["prediction"], result["fraud_probability"])
    
    return result