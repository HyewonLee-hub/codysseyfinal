"""Persistence queries for weak-subtype learning sessions and attempts."""

from datetime import datetime, timezone
from typing import TypedDict

from app.db.supabase import supabase
from app.schemas.learning import WeakLearningSubmitResponse


class LearningSession(TypedDict):
    id: str
    learner_id: str | None
    mode: str
    subtype_id: str | None
    status: str


class LearningSessionAttempt(TypedDict):
    question_id: str
    is_correct: bool
    answered_at: str


def create_learning_session(
    *,
    subtype_id: str,
    learner_id: str | None = None,
    mode: str = "weak_learning",
    status: str = "in_progress",
) -> str:
    """Create a learning session and return its generated ID."""
    started_at = datetime.now(timezone.utc).isoformat()
    session = {
        "learner_id": learner_id,
        "mode": mode,
        "subtype_id": subtype_id,
        "status": status,
        "started_at": started_at,
    }

    if status == "completed":
        session["completed_at"] = started_at

    response = supabase.table("learning_sessions").insert(session).execute()

    if not response.data:
        raise RuntimeError("Learning session insert did not return an ID.")

    return response.data[0]["id"]


def create_learning_attempt(
    *,
    learning_session_id: str,
    result: WeakLearningSubmitResponse,
    learner_id: str | None = None,
) -> None:
    """Store one weak-learning attempt for a learning session."""
    supabase.table("question_attempts").insert(
        {
            "learner_id": learner_id,
            "diagnostic_session_id": None,
            "learning_session_id": learning_session_id,
            "question_id": result.question_id,
            "subtype_id": result.subtype_id,
            "selected_choice": result.selected_choice,
            "is_correct": result.is_correct,
            "trap_id": result.trap_id,
            "context": "weak_learning",
            "answered_at": datetime.now(timezone.utc).isoformat(),
        }
    ).execute()


def get_learning_session(learning_session_id: str) -> LearningSession | None:
    """Return the minimum data required to validate a learning session."""
    response = (
        supabase.table("learning_sessions")
        .select("id, learner_id, mode, subtype_id, status")
        .eq("id", learning_session_id)
        .limit(1)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]


def get_learning_session_attempts(
    learning_session_id: str,
) -> list[LearningSessionAttempt]:
    """Return one session's attempts with the newest answer first."""
    response = (
        supabase.table("question_attempts")
        .select("question_id, is_correct, answered_at")
        .eq("learning_session_id", learning_session_id)
        .order("answered_at", desc=True)
        .execute()
    )

    return response.data


def complete_learning_session(learning_session_id: str) -> None:
    """Mark a learning session as completed at the current UTC time."""
    supabase.table("learning_sessions").update(
        {
            "status": "completed",
            "completed_at": datetime.now(timezone.utc).isoformat(),
        }
    ).eq("id", learning_session_id).execute()
