"""
==========================================================================
MISSIONOS FASTAPI BACKEND - RESPONSE SCHEMAS
==========================================================================
"""

from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, Field
import time

T = TypeVar("T")

class MetaInfo(BaseModel):
    timestamp: str = Field(default_factory=lambda: time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
    version: str = "v2.4.1-fastapi"

class ApiResponse(BaseModel, Generic[T]):
    status: str = "success"
    code: int = 200
    message: Optional[str] = None
    meta: MetaInfo = Field(default_factory=MetaInfo)
    data: T
