from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.all_schemas import UserCreate, UserResponse, LoginRequest, Token
from backend.app.core.security import get_password_hash, verify_password, create_access_token
import uuid

router = APIRouter()

# In-memory mock DB for rapid testing & standalone execution
MOCK_USERS = {
    "farmer@kisansetu.ai": {
        "id": uuid.UUID("a0000000-0000-0000-0000-000000000001"),
        "email": "farmer@kisansetu.ai",
        "hashed_password": get_password_hash("password123"),
        "full_name": "Sardar Gurpreet Singh",
        "phone": "+919876543210",
        "role": "farmer",
        "state": "Punjab",
        "district": "Ludhiana",
        "is_active": True,
        "is_verified": True,
        "admin_approved": True,
        "badge_title": "Progressive Kisan"
    }
}

@router.post("/register", response_model=UserResponse)
def register_user(payload: UserCreate):
    if payload.email in MOCK_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    # Auto-approve farmers/buyers; require review for scientists & officers
    requires_approval = payload.role in ["expert", "government"]
    
    user_record = {
        "id": uuid.uuid4(),
        "email": payload.email,
        "hashed_password": get_password_hash(payload.password),
        "full_name": payload.full_name,
        "phone": payload.phone,
        "role": payload.role,
        "state": payload.state,
        "district": payload.district,
        "is_active": True,
        "is_verified": True,
        "admin_approved": not requires_approval,
        "badge_title": "Verified Stakeholder",
        "net_worth": payload.net_worth or "Not provided"
    }
    MOCK_USERS[payload.email] = user_record
    return user_record

@router.post("/login", response_model=Token)
def login_user(payload: LoginRequest):
    user = MOCK_USERS.get(payload.email)
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your email and password."
        )
    
    token = create_access_token(subject=user["id"], role=user["role"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "user": user
    }
