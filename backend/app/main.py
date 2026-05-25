from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.prediction import router as prediction_router
from routes.admin import router as admin_router

app = FastAPI(
    title="Insurance Fraud Detection API",
    description="FastAPI Backend for Fraud Detection",
    version="1.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(prediction_router)
app.include_router(admin_router)

# Root Endpoint
@app.get("/")
def home():
    return {
        "message": "Insurance Fraud Detection API Running Successfully"
    }