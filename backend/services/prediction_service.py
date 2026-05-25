from models.model_loader import model

from services.preprocess import preprocess_input


def predict_fraud(data):

    processed_data = preprocess_input(data)

    prediction = model.predict(processed_data)

    probability = model.predict_proba(
        processed_data
    )

    fraud_probability = float(
        probability[0][1]
    )

    result = (
        "Fraudulent Claim"
        if prediction[0] == 1
        else "Genuine Claim"
    )

    return {

        "prediction": result,

        "fraud_probability":
        round(fraud_probability * 100, 2)
    }