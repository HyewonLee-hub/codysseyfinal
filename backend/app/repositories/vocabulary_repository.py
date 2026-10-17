"""Persistence operations for shared vocabulary and learner-specific word state."""

from datetime import datetime, timezone
from typing import TypedDict

from app.db.supabase import supabase


class VocabularyWord(TypedDict):
    id: str
    word: str
    meaning: str
    example: str | None
    difficulty: str | None
    created_at: str


class LearnerWord(TypedDict):
    id: int
    learner_id: str
    word_id: str
    is_saved: bool
    is_memorized: bool
    saved_at: str | None
    memorized_at: str | None
    created_at: str
    updated_at: str


class DailyWordAssignment(TypedDict):
    id: int
    learner_id: str
    word_id: str
    assigned_date: str
    created_at: str


class SavedWordRecord(TypedDict):
    word_id: str
    is_saved: bool
    is_memorized: bool
    saved_at: str | None
    memorized_at: str | None
    vocabulary_words: VocabularyWord | None


def get_word_by_id(word_id: str) -> VocabularyWord | None:
    """Return one shared vocabulary word by primary key."""
    response = (
        supabase.table("vocabulary_words")
        .select("id, word, meaning, example, difficulty, created_at")
        .eq("id", word_id)
        .limit(1)
        .execute()
    )
    return response.data[0] if response.data else None


def get_words_by_ids(word_ids: list[str]) -> list[VocabularyWord]:
    """Return shared vocabulary records for the supplied IDs."""
    if not word_ids:
        return []

    response = (
        supabase.table("vocabulary_words")
        .select("id, word, meaning, example, difficulty, created_at")
        .in_("id", word_ids)
        .execute()
    )
    return response.data


def get_all_vocabulary_words() -> list[VocabularyWord]:
    """Return the shared vocabulary pool without learner-specific policy."""
    response = (
        supabase.table("vocabulary_words")
        .select("id, word, meaning, example, difficulty, created_at")
        .order("word")
        .execute()
    )
    return response.data


def get_learner_word(learner_id: str, word_id: str) -> LearnerWord | None:
    """Return one learner's state for one vocabulary word."""
    response = (
        supabase.table("learner_words")
        .select(
            "id, learner_id, word_id, is_saved, is_memorized, saved_at, "
            "memorized_at, created_at, updated_at"
        )
        .eq("learner_id", learner_id)
        .eq("word_id", word_id)
        .limit(1)
        .execute()
    )
    return response.data[0] if response.data else None


def get_memorized_word_ids_for_learner(learner_id: str) -> set[str]:
    """Return word IDs that the learner has marked as memorized."""
    response = (
        supabase.table("learner_words")
        .select("word_id")
        .eq("learner_id", learner_id)
        .eq("is_memorized", True)
        .execute()
    )
    return {row["word_id"] for row in response.data}


def get_learner_word_states(
    learner_id: str,
    word_ids: list[str],
) -> list[LearnerWord]:
    """Return existing learner word-state rows for the supplied word IDs."""
    if not word_ids:
        return []

    response = (
        supabase.table("learner_words")
        .select(
            "id, learner_id, word_id, is_saved, is_memorized, saved_at, "
            "memorized_at, created_at, updated_at"
        )
        .eq("learner_id", learner_id)
        .in_("word_id", word_ids)
        .execute()
    )
    return response.data


def get_saved_words_for_learner(learner_id: str) -> list[SavedWordRecord]:
    """Return saved learner-word states joined with their shared word content."""
    response = (
        supabase.table("learner_words")
        .select(
            "word_id, is_saved, is_memorized, saved_at, memorized_at, "
            "vocabulary_words(id, word, meaning, example, difficulty)"
        )
        .eq("learner_id", learner_id)
        .eq("is_saved", True)
        .order("saved_at", desc=True, nullsfirst=False)
        .order("id", desc=True)
        .execute()
    )
    return response.data


def get_saved_vocabulary_words_for_learner(
    learner_id: str,
) -> list[VocabularyWord]:
    """Return vocabulary content for all words currently saved by one learner."""
    saved_records = get_saved_words_for_learner(learner_id)
    return [
        record["vocabulary_words"]
        for record in saved_records
        if isinstance(record.get("vocabulary_words"), dict)
    ]


def upsert_learner_word(
    *,
    learner_id: str,
    word_id: str,
    is_saved: bool,
    is_memorized: bool,
    saved_at: str | None,
    memorized_at: str | None,
) -> LearnerWord:
    """Persist a complete learner-word state using its unique owner/word key."""
    response = (
        supabase.table("learner_words")
        .upsert(
            {
                "learner_id": learner_id,
                "word_id": word_id,
                "is_saved": is_saved,
                "is_memorized": is_memorized,
                "saved_at": saved_at,
                "memorized_at": memorized_at,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            on_conflict="learner_id,word_id",
        )
        .execute()
    )

    if not response.data:
        raise RuntimeError("Learner word upsert did not return a row.")

    return response.data[0]


def ensure_learner_word(learner_id: str, word_id: str) -> None:
    """Create a default learner-word state if it does not already exist."""
    (
        supabase.table("learner_words")
        .upsert(
            {
                "learner_id": learner_id,
                "word_id": word_id,
            },
            on_conflict="learner_id,word_id",
            ignore_duplicates=True,
            default_to_null=False,
        )
        .execute()
    )


def update_learner_word_fields(
    learner_id: str,
    word_id: str,
    fields: dict[str, bool | str | None],
) -> LearnerWord:
    """Update only supplied state fields for an existing learner-word row."""
    if not fields:
        raise ValueError("At least one learner word field must be provided.")

    response = (
        supabase.table("learner_words")
        .update(
            {
                **fields,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        .eq("learner_id", learner_id)
        .eq("word_id", word_id)
        .execute()
    )
    if not response.data:
        raise RuntimeError("Learner word update did not return a row.")

    return response.data[0]


def get_daily_assignments(
    learner_id: str,
    assigned_date: str,
) -> list[DailyWordAssignment]:
    """Return one learner's assignments for one calendar date."""
    response = (
        supabase.table("daily_word_assignments")
        .select("id, learner_id, word_id, assigned_date, created_at")
        .eq("learner_id", learner_id)
        .eq("assigned_date", assigned_date)
        .order("created_at")
        .order("id")
        .execute()
    )
    return response.data


def create_daily_assignments(
    *,
    learner_id: str,
    word_ids: list[str],
    assigned_date: str,
) -> list[DailyWordAssignment]:
    """Insert explicit learner/date word assignments without selection logic."""
    if not word_ids:
        return []

    assignments = [
        {
            "learner_id": learner_id,
            "word_id": word_id,
            "assigned_date": assigned_date,
        }
        for word_id in word_ids
    ]
    response = (
        supabase.table("daily_word_assignments")
        .upsert(
            assignments,
            on_conflict="learner_id,word_id,assigned_date",
            ignore_duplicates=True,
        )
        .execute()
    )
    return response.data
