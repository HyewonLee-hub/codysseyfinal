"""Raw learner attempt retrieval for deterministic learning recommendations."""

from typing import TypedDict

from app.db.supabase import supabase


class LearnerRecommendationAttempt(TypedDict):
    id: int
    subtype_id: str | None
    subtype_name: str | None
    type_id: str | None
    type_name: str | None
    is_correct: bool
    trap_id: str | None
    trap_name: str | None
    trap_description: str | None
    context: str | None
    answered_at: str


def get_learner_toeic_attempts(
    learner_id: str,
) -> list[LearnerRecommendationAttempt]:
    """Return all learner-owned TOEIC attempts, newest first, with taxonomy data.

    Vocabulary quizzes use separate tables and therefore never enter this query.
    ``context`` remains available for auditability, including legacy diagnostic
    attempts created before it was populated.
    """
    response = (
        supabase.table("question_attempts")
        .select(
            "id, subtype_id, is_correct, trap_id, context, answered_at, "
            "subtypes(id, name, type_id, types(id, name)), "
            "traps(id, name, description)"
        )
        .eq("learner_id", learner_id)
        .order("answered_at", desc=True)
        .order("id", desc=True)
        .execute()
    )

    attempts: list[LearnerRecommendationAttempt] = []
    for row in response.data:
        subtype = row.get("subtypes") or {}
        parent_type = subtype.get("types") or {}
        trap = row.get("traps") or {}
        attempts.append(
            {
                "id": row["id"],
                "subtype_id": row.get("subtype_id"),
                "subtype_name": subtype.get("name"),
                "type_id": subtype.get("type_id"),
                "type_name": parent_type.get("name"),
                "is_correct": row["is_correct"],
                "trap_id": row.get("trap_id"),
                "trap_name": trap.get("name"),
                "trap_description": trap.get("description"),
                "context": row.get("context"),
                "answered_at": row["answered_at"],
            }
        )

    return attempts
