"""Persistence queries for completed diagnostic sessions and attempts."""

from datetime import datetime, timezone

from app.db.supabase import supabase
from app.schemas.diagnostic import DiagnosticItemGradingResult


def create_diagnostic_session(
    *,
    total_questions: int,
    correct_count: int,
    accuracy: float,
    learner_id: str | None = None,
    estimated_score: int | None = None,
) -> str:
    """Create a completed diagnostic session and return its generated ID."""
    completed_at = datetime.now(timezone.utc).isoformat()
    response = (
        supabase.table("diagnostic_sessions")
        .insert(
            {
                "learner_id": learner_id,
                "status": "completed",
                "total_questions": total_questions,
                "correct_count": correct_count,
                "accuracy": accuracy,
                "estimated_score": estimated_score,
                "started_at": completed_at,
                "completed_at": completed_at,
            }
        )
        .execute()
    )

    if not response.data:
        raise RuntimeError("Diagnostic session insert did not return an ID.")

    return response.data[0]["id"]


def create_question_attempts(
    *,
    diagnostic_session_id: str,
    results: list[DiagnosticItemGradingResult],
    learner_id: str | None = None,
) -> None:
    """Bulk insert graded attempts for one diagnostic session."""
    if not results:
        return

    answered_at = datetime.now(timezone.utc).isoformat()
    attempts = [
        {
            "learner_id": learner_id,
            "diagnostic_session_id": diagnostic_session_id,
            "question_id": result.question_id,
            "subtype_id": result.subtype_id,
            "selected_choice": result.selected_choice,
            "is_correct": result.is_correct,
            "trap_id": result.trap_id,
            "answered_at": answered_at,
        }
        for result in results
    ]

    supabase.table("question_attempts").insert(attempts).execute()
