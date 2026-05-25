import pandas as pd
import numpy as np

from models.model_loader import (
    scaler,
    label_encoders,
    training_columns
)

def preprocess_input(data):

    # Convert JSON to DataFrame
    df = pd.DataFrame([data])

    # ==========================================
    # RENAME COLUMNS TO MATCH TRAINING DATASET
    # ==========================================

    df.rename(columns={

        "capital_gains": "capital-gains",
        "capital_loss": "capital-loss"

    }, inplace=True)

    # ==========================================
    # FEATURE ENGINEERING
    # ==========================================

    current_year = 2025

    df['vehicle_age'] = (
        current_year - df['auto_year']
    )

    df['claim_ratio'] = (
        df['total_claim_amount'] /
        df['policy_annual_premium']
    )

    df['injury_severity_score'] = (
        df['injury_claim'] +
        (df['bodily_injuries'] * 1000)
    )

    # ==========================================
    # ADD MISSING COLUMNS
    # ==========================================

    for col in training_columns:

        if col not in df.columns:

            df[col] = 0

    # ==========================================
    # KEEP EXACT TRAINING ORDER
    # ==========================================

    df = df[training_columns]

    # ==========================================
    # ENCODE CATEGORICALS
    # ==========================================

    categorical_cols = [

        'policy_state',
        'policy_csl',
        'insured_sex',
        'insured_education_level',
        'insured_occupation',
        'insured_hobbies',
        'insured_relationship',
        'incident_type',
        'collision_type',
        'incident_severity',
        'authorities_contacted',
        'incident_state',
        'incident_city',
        'auto_make',
        'auto_model'
    ]

    for col in categorical_cols:

        if col in label_encoders:

            encoder = label_encoders[col]

            try:

                df[col] = encoder.transform(
                    df[col].astype(str)
                )

            except:

                df[col] = 0

    # ==========================================
    # CONVERT EVERYTHING TO NUMERIC
    # ==========================================

    df = df.apply(
        pd.to_numeric,
        errors='coerce'
    )

    df.fillna(0, inplace=True)

    # ==========================================
    # SCALE
    # ==========================================

    scaled_data = scaler.transform(df)

    return scaled_data