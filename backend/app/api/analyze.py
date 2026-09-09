from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze")
def analyze():
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented"
    )
