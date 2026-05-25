import json
import os
from datetime import datetime

# Determine path relative to backend directory (one level up from services)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HISTORY_FILE = os.path.join(BASE_DIR, "saved_models", "history.json")

def get_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading history: {e}")
        return []

def add_history_record(input_data, prediction, probability):
    record = {
        "timestamp": datetime.now().isoformat(),
        "age": input_data.get("age"),
        "policy_state": input_data.get("policy_state"),
        "total_claim_amount": input_data.get("total_claim_amount"),
        "auto_make": input_data.get("auto_make"),
        "auto_model": input_data.get("auto_model"),
        "prediction": prediction,
        "fraud_probability": probability
    }
    history = get_history()
    history.insert(0, record)  # Keep newest first
    
    # Cap history at 100 entries
    if len(history) > 100:
        history = history[:100]
        
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
        with open(HISTORY_FILE, "w") as f:
            json.dump(history, f, indent=4)
    except Exception as e:
        print(f"Error saving history: {e}")
