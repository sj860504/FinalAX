from fastapi import APIRouter, HTTPException, status

router = APIRouter(prefix="/api/items", tags=["items"])

NOT_IMPLEMENTED = HTTPException(
    status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented"
)


@router.get("")
def list_items(limit: int = 20, offset: int = 0, q: str | None = None):
    raise NOT_IMPLEMENTED


@router.post("", status_code=status.HTTP_201_CREATED)
def create_item():
    raise NOT_IMPLEMENTED


@router.get("/{item_id}")
def get_item(item_id: int):
    raise NOT_IMPLEMENTED
