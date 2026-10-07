import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Numeric, Integer, Text, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    role = Column(String(50), nullable=False, default="farmer", index=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    admin_approved = Column(Boolean, default=False)
    badge_title = Column(String(100), default="Farmer")
    created_at = Column(DateTime, default=datetime.utcnow)

    farms = relationship("Farm", back_populates="owner", cascade="all, delete-orphan")
    expenses = relationship("FarmExpense", back_populates="user", cascade="all, delete-orphan")

class Farm(Base):
    __tablename__ = "farms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    farm_name = Column(String(150), nullable=False)
    area_acres = Column(Numeric(8, 2), nullable=False)
    soil_type = Column(String(80), nullable=False)
    water_source = Column(String(80), nullable=False)
    irrigation_type = Column(String(80), nullable=False)
    latitude = Column(Numeric(10, 6), nullable=False)
    longitude = Column(Numeric(10, 6), nullable=False)

    owner = relationship("User", back_populates="farms")
    crops = relationship("Crop", back_populates="farm", cascade="all, delete-orphan")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id"), nullable=False, index=True)
    crop_name = Column(String(100), nullable=False)
    variety = Column(String(100), nullable=False)
    sowing_date = Column(Date, nullable=False)
    expected_harvest_date = Column(Date, nullable=False)
    growth_stage = Column(String(50), default="Germination")
    growth_progress_percent = Column(Integer, default=10)
    expected_yield_quintals = Column(Numeric(10, 2), nullable=False)
    health_score = Column(Integer, default=95)
    status = Column(String(50), default="Healthy")

    farm = relationship("Farm", back_populates="crops")

class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    commodity = Column(String(100), nullable=False, index=True)
    mandi_name = Column(String(150), nullable=False)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False)
    modal_price = Column(Numeric(10, 2), nullable=False)
    min_price = Column(Numeric(10, 2), nullable=False)
    max_price = Column(Numeric(10, 2), nullable=False)
    arrival_quantity_tons = Column(Numeric(10, 2), default=0.0)
    price_change_percent = Column(Numeric(5, 2), default=0.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)

class FarmExpense(Base):
    __tablename__ = "farm_expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    expense_date = Column(Date, nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    amount_inr = Column(Numeric(12, 2), nullable=False)

    user = relationship("User", back_populates="expenses")
