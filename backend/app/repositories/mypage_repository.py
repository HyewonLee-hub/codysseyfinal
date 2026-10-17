"""Read-only persistence queries for the authenticated learner's report history."""

from typing import TypedDict

from app.db.supabase import supabase


class CompletedDiagnosticSession(TypedDict):
    id: str
    status: str
    created_at: str
    completed_at: str | None


class CompletedLearningSession(TypedDict):
    id: str
    mode: str
    status: str
    created_at: str
    completed_at: str | None


class SessionAttemptResult(TypedDict):
    diagnostic_session_id: str | None
    learning_session_id: str | None
    is_correct: bool


def get_completed_diagnostic_sessions(
    learner_id: str,
) -> list[CompletedDiagnosticSession]:
    """Return completed diagnostic sessions owned by one learner."""
    response = (
        supabase.table("diagnostic_sessions")
        .select("id, status, created_at, completed_at")
        .eq("learner_id", learner_id)
        .eq("status", "completed")
        .execute()
    )
    return response.data


def get_completed_learning_sessions(
    learner_id: str,
) -> list[CompletedLearningSession]:
    """Return completed reportable learning sessions owned by one learner."""
    response = (
        supabase.table("learning_sessions")
        .select("id, mode, status, created_at, completed_at")
        .eq("learner_id", learner_id)
        .eq("status", "completed")
        .in_(
            "mode",
            [
                "weak_learning",
                "daily_general",
                "daily_vocabulary",
                "daily_grammar",
            ],
        )
        .execute()
    )
    return response.data


def get_diagnostic_attempt_results(
    diagnostic_session_ids: list[str],
) -> list[SessionAttemptResult]:
    """Return only the grading result needed to aggregate diagnostic sessions."""
    if not diagnostic_session_ids:
        return []

    response = (
        supabase.table("question_attempts")
        .select("diagnostic_session_id, learning_session_id, is_correct")
        .in_("diagnostic_session_id", diagnostic_session_ids)
        .execute()
    )
    return response.data


def get_learning_attempt_results(
    learning_session_ids: list[str],
) -> list[SessionAttemptResult]:
    """Return only the grading result needed to aggregate learning sessions."""
    if not learning_session_ids:
        return []

    response = (
        supabase.table("question_attempts")
        .select("diagnostic_session_id, learning_session_id, is_correct")
        .in_("learning_session_id", learning_session_ids)
        .execute()
    )
    return response.data
