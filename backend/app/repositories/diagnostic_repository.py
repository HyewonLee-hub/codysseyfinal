"""Persistence queries for completed diagnostic sessions and attempts."""

from datetime import datetime, timezone
from typing import TypedDict

from app.db.supabase import supabase
from app.schemas.diagnostic import DiagnosticItemGradingResult


class DiagnosticAttemptWithTaxonomy(TypedDict):
    question_id: str
    subtype_id: str | None
    subtype_name: str | None
    type_id: str | None
    type_name: str | None
    is_correct: bool


class DiagnosticSessionOwner(TypedDict):
    id: str
    learner_id: str | None


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
) -> dict[str, int]:
    """Bulk insert diagnostic attempts and return IDs keyed by question ID."""
    if not results:
        return {}

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

    response = supabase.table("question_attempts").insert(attempts).execute()
    return _attempt_ids_by_question_id(response.data, [result.question_id for result in results])


def _attempt_ids_by_question_id(
    inserted_rows: list[dict[str, object]],
    expected_question_ids: list[str],
) -> dict[str, int]:
    """Validate insert output without assuming a bulk-insert row order."""
    if len(expected_question_ids) != len(set(expected_question_ids)):
        raise RuntimeError("Diagnostic attempt question IDs must be unique.")

    attempt_ids: dict[str, int] = {}
    for row in inserted_rows:
        question_id = row.get("question_id")
        attempt_id = row.get("id")
        if not isinstance(question_id, str) or not isinstance(attempt_id, int):
            raise RuntimeError("Diagnostic attempt insert returned incomplete data.")
        if question_id in attempt_ids:
            raise RuntimeError("Diagnostic attempt insert returned duplicate question IDs.")
        attempt_ids[question_id] = attempt_id

    if set(attempt_ids) != set(expected_question_ids):
        raise RuntimeError("Diagnostic attempt insert did not return every question ID.")

    return attempt_ids


def diagnostic_session_exists(diagnostic_session_id: str) -> bool:
    """Return whether a diagnostic session exists."""
    response = (
        supabase.table("diagnostic_sessions")
        .select("id")
        .eq("id", diagnostic_session_id)
        .limit(1)
        .execute()
    )

    return bool(response.data)


def get_diagnostic_session_owner(
    diagnostic_session_id: str,
) -> DiagnosticSessionOwner | None:
    """Return the owner data needed to authorize one diagnostic report."""
    response = (
        supabase.table("diagnostic_sessions")
        .select("id, learner_id")
        .eq("id", diagnostic_session_id)
        .limit(1)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]


def get_diagnostic_attempts_with_taxonomy(
    diagnostic_session_id: str,
) -> list[DiagnosticAttemptWithTaxonomy]:
    """Return a session's attempts with their question subtype and type data."""
    response = (
        supabase.table("question_attempts")
        .select(
            "question_id, subtype_id, is_correct, "
            "questions(subtype_id, subtypes(id, name, type_id, types(id, name)))"
        )
        .eq("diagnostic_session_id", diagnostic_session_id)
        .execute()
    )

    attempts: list[DiagnosticAttemptWithTaxonomy] = []

    for row in response.data:
        question = row.get("questions") or {}
        subtype = question.get("subtypes") or {}
        question_type = subtype.get("types") or {}

        attempts.append(
            {
                "question_id": row["question_id"],
                "subtype_id": row.get("subtype_id") or question.get("subtype_id"),
                "subtype_name": subtype.get("name"),
                "type_id": subtype.get("type_id"),
                "type_name": question_type.get("name"),
                "is_correct": row["is_correct"],
            }
        )

    return attempts
