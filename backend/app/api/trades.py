from fastapi import APIRouter

router = APIRouter()



@router.get("/trades/")
def get_trade():
    all_trades = ["Painting", "Plumbing", "Electrical"]


    return {"trades": all_trades}