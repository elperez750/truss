from fastapi import APIRouter

router = APIRouter()


@router.get("/users")
async def get_users():
    return [{"username": "Rick"}, {"username": "Morty"}]

@router.post("/")
def create_user():
    return {"message": "User created successfully"}

