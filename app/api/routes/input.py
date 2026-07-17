from fastapi import APIRouter, HTTPException
from app.services.input_service import INPUT_SERVICE
from app.api.models.input_models import (
    InputResponseRequest,
    InputResponseResult,
)

router = APIRouter(
    prefix="/api/input",
    tags=["Input"],
)

@router.post(
    "/respond",
    response_model=InputResponseResult,
)
async def respond(
    request: InputResponseRequest,
):
    success = await INPUT_SERVICE.submit(
        request.request_id,
        request.value,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Input request not found.",
        )

    return InputResponseResult(
        success=True,
    )