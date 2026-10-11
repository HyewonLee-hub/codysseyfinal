"""Endpoints for weak-subtype practice learning."""

from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.schemas.learning import (
    LearningTestItemsResponse,
    LearningTestReportResponse,
    LearningTestStartRequest,
    LearningTestStartResponse,
    LearningTestSubmitRequest,
    LearningTestSubmitResponse,
    WeakLearningItemResponse,
    WeakLearningReportResponse,
    WeakLearningStartRequest,
    WeakLearningStartResponse,
    WeakLearningSubmitRequest,
    WeakLearningSubmitResponse,
)
from app.services.weak_learning_service import (
    get_weak_learning_item,
    start_weak_learning_session,
    submit_weak_learning_answer as submit_weak_learning_answer_service,
)
from app.services.weak_learning_report_service import get_weak_learning_report
from app.services.learning_test_service import (
    get_learning_test_items,
    start_learning_test_session,
    submit_learning_test,
)
from app.services.learning_test_report_service import get_learning_test_report


router = APIRouter(prefix="/learning", tags=["learning"])


@router.post("/test/start", response_model=LearningTestStartResponse)
def start_learning_test(
    request: LearningTestStartRequest,
) -> LearningTestStartResponse:
    """Start an anonymous general learning-test session."""
    try:
        learning_session_id = start_learning_test_session(
            mode=request.mode,
            learner_id=None,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to start learning test session.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to start learning test session.",
        ) from error

    return LearningTestStartResponse(
        learning_session_id=learning_session_id,
        mode=request.mode,
        status="in_progress",
    )


@router.get(
    "/test/{learning_session_id}/items",
    response_model=LearningTestItemsResponse,
)
def read_learning_test_items(
    learning_session_id: str,
) -> LearningTestItemsResponse:
    """Return 20 public practice items for an active learning-test session."""
    try:
        UUID(learning_session_id)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail="learning_session_id must be a valid UUID.",
        ) from error

    try:
        return get_learning_test_items(learning_session_id)
    except ValueError as error:
        status_code = (
            404 if str(error) == "Learning test session not found." else 400
        )
        raise HTTPException(status_code=status_code, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve learning test items.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve learning test items.",
        ) from error


@router.get(
    "/test/{learning_session_id}/report",
    response_model=LearningTestReportResponse,
)
def read_learning_test_report(
    learning_session_id: str,
) -> LearningTestReportResponse:
    """Return the read-only report for one completed general learning test."""
    try:
        UUID(learning_session_id)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail="learning_session_id must be a valid UUID.",
        ) from error

    try:
        return get_learning_test_report(learning_session_id)
    except ValueError as error:
        status_code = 404 if str(error) == "Learning test session not found." else 400
        raise HTTPException(status_code=status_code, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve learning test report.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve learning test report.",
        ) from error


@router.post("/test/submit", response_model=LearningTestSubmitResponse)
def submit_learning_test_answers(
    submission: LearningTestSubmitRequest,
) -> LearningTestSubmitResponse:
    """Grade and store all assigned answers for one general learning test."""
    try:
        UUID(submission.learning_session_id)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail="learning_session_id must be a valid UUID.",
        ) from error

    try:
        return submit_learning_test(submission, learner_id=None)
    except ValueError as error:
        status_code = 404 if str(error) == "Learning test session not found." else 400
        raise HTTPException(status_code=status_code, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to submit learning test.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to submit learning test.",
        ) from error


@router.get("/weak/{subtype_id}/item", response_model=WeakLearningItemResponse)
def read_weak_learning_item(subtype_id: str) -> WeakLearningItemResponse:
    """Return one random public practice item for a weak subtype."""
    item = get_weak_learning_item(subtype_id)

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="No practice questions found for this subtype.",
        )

    return WeakLearningItemResponse(**item)


@router.get(
    "/weak/{learning_session_id}/report",
    response_model=WeakLearningReportResponse,
)
def read_weak_learning_report(
    learning_session_id: str,
) -> WeakLearningReportResponse:
    """Return the report for a weak-learning session."""
    try:
        UUID(learning_session_id)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail="learning_session_id must be a valid UUID.",
        ) from error

    try:
        return get_weak_learning_report(learning_session_id)
    except ValueError as error:
        status_code = (
            404
            if str(error)
            in {
                "Learning session not found.",
                "Learning session has no attempts.",
            }
            else 400
        )
        raise HTTPException(status_code=status_code, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve weak learning report.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve weak learning report.",
        ) from error


@router.post("/weak/submit", response_model=WeakLearningSubmitResponse)
def submit_weak_learning_answer(
    submission: WeakLearningSubmitRequest,
) -> WeakLearningSubmitResponse:
    """Validate a session, grade one practice answer, and store its attempt."""
    try:
        UUID(submission.learning_session_id)
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail="learning_session_id must be a valid UUID.",
        ) from error

    try:
        return submit_weak_learning_answer_service(submission, learner_id=None)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to grade weak learning answer.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to grade weak learning answer.",
        ) from error


@router.post("/weak/start", response_model=WeakLearningStartResponse)
def start_weak_learning(
    request: WeakLearningStartRequest,
) -> WeakLearningStartResponse:
    """Start an anonymous in-progress weak-subtype learning session."""
    try:
        learning_session_id = start_weak_learning_session(
            subtype_id=request.subtype_id,
            learner_id=None,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to start weak learning session.",
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to start weak learning session.",
        ) from error

    return WeakLearningStartResponse(
        learning_session_id=learning_session_id,
        subtype_id=request.subtype_id,
        status="in_progress",
    )
