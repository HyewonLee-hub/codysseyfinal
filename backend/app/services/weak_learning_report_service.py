"""Read-only report calculation for weak-subtype learning sessions."""

from app.repositories.learning_repository import (
    get_learning_session,
    get_learning_session_attempt_details,
    get_learning_subtype_taxonomy,
)
from app.schemas.learning import TrapCountResponse, WeakLearningReportResponse
from app.services.weak_learning_service import get_weak_learning_progress


def get_weak_learning_report(
    learning_session_id: str,
    learner_id: str,
) -> WeakLearningReportResponse:
    """Build a report for one weak-learning session without persisting data."""
    session = get_learning_session(learning_session_id)

    if session is None:
        raise ValueError("Learning session not found.")

    if session["learner_id"] != learner_id:
        raise ValueError("Learning session not found.")

    if session["mode"] != "weak_learning":
        raise ValueError("Learning session is not a weak-learning session.")

    subtype_id = session["subtype_id"]

    if subtype_id is None:
        raise RuntimeError("Learning session is missing subtype data.")

    attempts = get_learning_session_attempt_details(learning_session_id)

    if not attempts:
        raise ValueError("Learning session has no attempts.")

    taxonomy = get_learning_subtype_taxonomy(subtype_id)

    if taxonomy is None:
        raise RuntimeError("Learning session subtype taxonomy was not found.")

    if None in (
        taxonomy["subtype_name"],
        taxonomy["type_id"],
        taxonomy["type_name"],
    ):
        raise RuntimeError("Learning session subtype taxonomy is incomplete.")

    correct_count = 0
    trap_count_by_id: dict[str, int] = {}

    for attempt in attempts:
        if attempt["subtype_id"] != subtype_id:
            raise RuntimeError("Learning session attempt subtype does not match session.")

        if attempt["is_correct"]:
            correct_count += 1
            continue

        trap_id = attempt["trap_id"]

        if trap_id is not None:
            trap_count_by_id[trap_id] = trap_count_by_id.get(trap_id, 0) + 1

    total_questions = len(attempts)
    progress = get_weak_learning_progress(learning_session_id)
    trap_counts = [
        TrapCountResponse(trap_id=trap_id, count=count)
        for trap_id, count in sorted(
            trap_count_by_id.items(),
            key=lambda item: (-item[1], item[0]),
        )
    ]

    return WeakLearningReportResponse(
        learning_session_id=learning_session_id,
        subtype_id=subtype_id,
        subtype_name=taxonomy["subtype_name"],
        type_id=taxonomy["type_id"],
        type_name=taxonomy["type_name"],
        status=session["status"],
        total_questions=total_questions,
        correct_count=correct_count,
        accuracy=round(correct_count / total_questions * 100, 2),
        final_correct_streak=progress["correct_streak"],
        trap_counts=trap_counts,
        started_at=session["started_at"],
        completed_at=session["completed_at"],
    )
