from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core import supabase


router = APIRouter()


class SignUpRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    phone_number: str
    role: str


