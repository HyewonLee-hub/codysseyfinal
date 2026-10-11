"""Endpoints for the free diagnostic."""

from fastapi import APIRouter, HTTPException, Query

from app.schemas.diagnostic import (
    DiagnosticItemsResponse,
    DiagnosticSubmitRequest,
    DiagnosticSubmitResponse,
)
from app.services.diagnostic_service import get_diagnostic_items, submit_diagnostic


router = APIRouter(prefix="/diagnostic", tags=["diagnostic"])


@router.get("/items", response_model=DiagnosticItemsResponse)
def read_diagnostic_items(
    limit: int = Query(default=20, ge=1),
) -> DiagnosticItemsResponse:
    """Return randomly selected public diagnostic items."""
    items = get_diagnostic_items(limit=limit)

    return DiagnosticItemsResponse(items=items, count=len(items))


@router.post("/submit", response_model=DiagnosticSubmitResponse)
def submit_diagnostic_answers(
    submission: DiagnosticSubmitRequest,
) -> DiagnosticSubmitResponse:
    """Grade and persist an anonymous diagnostic submission."""
    try:
        return submit_diagnostic(submission=submission, learner_id=None)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to submit diagnostic.",
        ) from error
