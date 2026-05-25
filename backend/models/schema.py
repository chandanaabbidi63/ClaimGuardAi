from pydantic import BaseModel

class InsuranceClaimInput(BaseModel):

    months_as_customer: int
    age: int
    policy_state: str
    policy_csl: str
    policy_deductable: int
    policy_annual_premium: float
    umbrella_limit: int

    insured_sex: str
    insured_education_level: str
    insured_occupation: str
    insured_hobbies: str
    insured_relationship: str

    capital_gains: int
    capital_loss: int

    incident_type: str
    collision_type: str
    incident_severity: str
    authorities_contacted: str
    incident_state: str
    incident_city: str

    incident_hour_of_the_day: int
    number_of_vehicles_involved: int
    bodily_injuries: int
    witnesses: int

    total_claim_amount: float
    injury_claim: float
    property_claim: float
    vehicle_claim: float

    auto_make: str
    auto_model: str
    auto_year: int