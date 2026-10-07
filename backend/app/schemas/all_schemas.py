from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
import uuid

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: str
    role: str
    state: str
    district: str
    net_worth: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    is_verified: bool
    admin_approved: bool
    badge_title: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Mandi Price Schemas
class MandiPriceResponse(BaseModel):
    id: uuid.UUID
    commodity: str
    mandi_name: str
    state: str
    district: str
    modal_price: float
    min_price: float
    max_price: float
    price_change_percent: float
    arrival_quantity_tons: float

# AI Price Prediction Schema
class PriceForecastResponse(BaseModel):
    commodity: str
    current_price: float
    recommendation: str
    recommended_hold_days: int
    expected_peak_price: float
    confidence_score: float
    reason: str
    points: List[dict]

# Leaf Disease Diagnosis
class DiseaseDetectRequest(BaseModel):
    crop: str
    image_base64: Optional[str] = None
    sample_key: Optional[str] = None

class DiseaseDetectResponse(BaseModel):
    crop: str
    disease_name: str
    scientific_name: str
    confidence_percent: float
    severity: str
    chemical_treatment: str
    organic_treatment: str
    preventive_measures: str

# KisanGPT Chat Request
class KisanGptRequest(BaseModel):
    message: str
    language: str = "en"

class KisanGptResponse(BaseModel):
    reply: str
    source_databanks: List[str]
    timestamp: str
