from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .trades import router as trades_router


router = APIRouter(prefix='/api/v1')

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(trades_router, prefix="/trades", tags=["trades"])

__all__ = ["router"]
