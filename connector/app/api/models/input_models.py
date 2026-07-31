from pydantic import BaseModel

class InputResponseRequest(BaseModel):
    request_id: str
    value: str

class InputResponseResult(BaseModel):
    success: bool