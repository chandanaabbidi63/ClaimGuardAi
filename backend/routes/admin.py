import csv
import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from services.analytics import get_dataset_stats
from services.train import get_current_metrics, retrain_model
from services.history import get_history
from services.prediction_service import predict_fraud

router = APIRouter(prefix="/admin", tags=["Admin & Analytics"])

@router.get("/stats")
def stats():
    data = get_dataset_stats()
    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])
    return data

@router.get("/metrics")
def metrics():
    return get_current_metrics()

@router.get("/history")
def history():
    return get_history()

@router.post("/retrain")
def retrain():
    res = retrain_model()
    if "error" in res:
        raise HTTPException(status_code=500, detail=res["error"])
    return res

@router.post("/predict-batch")
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # We need to process each row
        # Ensure we have all necessary columns
        results = []
        for idx, row in df.iterrows():
            row_dict = row.to_dict()
            
            # Clean keys to match expected schema if needed
            # In our schema we expect certain keys, let's map them if they have hyphens or underscores
            cleaned_row = {}
            for k, v in row_dict.items():
                # Map column names if they are named slightly differently in CSV
                k_clean = k.replace("-", "_")
                cleaned_row[k_clean] = v
                
            try:
                pred_res = predict_fraud(cleaned_row)
                results.append({
                    "row_index": idx,
                    "prediction": pred_res["prediction"],
                    "fraud_probability": pred_res["fraud_probability"],
                    "age": cleaned_row.get("age", "N/A"),
                    "policy_state": cleaned_row.get("policy_state", "N/A"),
                    "total_claim_amount": cleaned_row.get("total_claim_amount", 0),
                    "auto_make": cleaned_row.get("auto_make", "N/A"),
                    "auto_model": cleaned_row.get("auto_model", "N/A"),
                })
            except Exception as e:
                # Add placeholder on error
                results.append({
                    "row_index": idx,
                    "prediction": "Error",
                    "fraud_probability": 0.0,
                    "error": str(e)
                })
                
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CSV file: {str(e)}")
