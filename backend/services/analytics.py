import os
import pandas as pd
import numpy as np

# Determine backend directory (one level up from services)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# fraud_insurance_claims.csv is in the parent of the backend directory (repository root)
CSV_PATH = os.path.join(os.path.dirname(BASE_DIR), "fraud_insurance_claims.csv")

def get_dataset_stats():
    # Attempt to locate the CSV file
    path = CSV_PATH
    if not os.path.exists(path):
        # Fallback to backend root if it's there
        path = os.path.join(BASE_DIR, "fraud_insurance_claims.csv")
        if not os.path.exists(path):
            return {"error": "Dataset fraud_insurance_claims.csv not found"}

    try:
        df = pd.read_csv(path)
        
        # Clean fraud reported
        df['fraud_reported'] = df['fraud_reported'].str.strip().str.upper()
        df['fraud_bool'] = df['fraud_reported'].map({'Y': 1, 'N': 0})
        
        total_claims = len(df)
        fraud_cases = int(df['fraud_bool'].sum())
        fraud_rate = float(round((fraud_cases / total_claims) * 100, 2))
        
        avg_claim = float(round(df['total_claim_amount'].mean(), 2))
        avg_claim_fraud = float(round(df[df['fraud_bool'] == 1]['total_claim_amount'].mean(), 2))
        avg_claim_genuine = float(round(df[df['fraud_bool'] == 0]['total_claim_amount'].mean(), 2))
        
        # State distribution
        state_stats = []
        for state, group in df.groupby('policy_state'):
            state_total = len(group)
            state_fraud = int(group['fraud_bool'].sum())
            state_stats.append({
                "state": state,
                "total": state_total,
                "fraud": state_total - state_total if state_total == 0 else int((state_fraud / state_total) * 100)
            })
            
        # Severity stats
        severity_stats = []
        for sev, group in df.groupby('incident_severity'):
            sev_total = len(group)
            sev_fraud = int(group['fraud_bool'].sum())
            severity_stats.append({
                "severity": sev,
                "total": sev_total,
                "fraud_rate": float(round((sev_fraud / sev_total) * 100, 2)) if sev_total > 0 else 0
            })
            
        # Auto make stats (Top 10 auto makes)
        auto_stats = []
        for make, group in df.groupby('auto_make'):
            make_total = len(group)
            make_fraud = int(group['fraud_bool'].sum())
            auto_stats.append({
                "make": make,
                "total": make_total,
                "fraud_rate": float(round((make_fraud / make_total) * 100, 2)) if make_total > 0 else 0
            })
        auto_stats = sorted(auto_stats, key=lambda x: x['total'], reverse=True)[:10]

        # Age group stats
        df['age_group'] = pd.cut(df['age'], bins=[0, 30, 45, 60, 100], labels=['Under 30', '30-45', '45-60', 'Over 60'])
        age_stats = []
        for age_g, group in df.groupby('age_group', observed=False):
            age_total = len(group)
            age_fraud = int(group['fraud_bool'].sum())
            age_stats.append({
                "group": age_g,
                "total": age_total,
                "fraud_rate": float(round((age_fraud / age_total) * 100, 2)) if age_total > 0 else 0
            })

        return {
            "total_claims": total_claims,
            "fraud_cases": fraud_cases,
            "fraud_rate": fraud_rate,
            "avg_claim": avg_claim,
            "avg_claim_fraud": avg_claim_fraud,
            "avg_claim_genuine": avg_claim_genuine,
            "state_stats": state_stats,
            "severity_stats": severity_stats,
            "auto_stats": auto_stats,
            "age_stats": age_stats
        }

    except Exception as e:
        return {"error": f"Failed to compute dataset stats: {str(e)}"}
