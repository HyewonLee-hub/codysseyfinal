"""Workflow for owned-attempt retrieval, generation, validation, and caching."""

import json

from pydantic import ValidationError

from app.clients.openai_client import AIProviderError, generate_explanation
from app.core.config import OPENAI_MODEL
from app.repositories.ai_explanation_repository import (
    create_ai_explanation,
    get_cached_ai_explanation,
    get_owned_question_attempt,
)
from app.schemas.ai import AIExplanationContent, AIExplanationResponse
from app.services.ai_retrieval_service import retrieve_explanation_context


class ExplanationAttemptNotFoundError(ValueError):
    """Raised when an attempt does not exist or is not owned by the learner."""


def _validated_cached_content(content: object) -> AIExplanationContent:
    """Treat malformed cache data as an internal consistency failure."""
    try:
        return AIExplanationContent.model_validate(content)
    except ValidationError as error:
        raise RuntimeError("Cached AI explanation has an invalid structure.") from error


def _parse_provider_content(raw_content: str) -> AIExplanationContent:
    """Validate the provider's JSON-only contract with the public schema."""
    try:
        return AIExplanationContent.model_validate(json.loads(raw_content))
    except (json.JSONDecodeError, ValidationError, TypeError) as error:
        raise AIProviderError("AI provider response could not be validated.") from error


def get_ai_explanation(
    attempt_id: int,
    learner_id: str,
) -> AIExplanationResponse:
    """Return a cached or newly generated explanation for an owned attempt."""
    attempt = get_owned_question_attempt(attempt_id, learner_id)
    if attempt is None:
        # A missing and another learner's attempt intentionally look identical.
        raise ExplanationAttemptNotFoundError("Question attempt not found.")

    cached = get_cached_ai_explanation(attempt_id)
    if cached is not None:
        return AIExplanationResponse(
            attempt_id=attempt_id,
            cached=True,
            model=cached["model"],
            explanation=_validated_cached_content(cached["content"]),
        )

    context = retrieve_explanation_context(attempt)
    explanation = _parse_provider_content(generate_explanation(context))

    try:
        create_ai_explanation(
            learner_id=learner_id,
            attempt_id=attempt_id,
            content=explanation.model_dump(mode="json"),
            model=OPENAI_MODEL or "",
        )
    except Exception as create_error:
        # A concurrent request can win the UNIQUE(attempt_id) race. Prefer its
        # completed cache over reporting an unnecessary conflict to the caller.
        cached = get_cached_ai_explanation(attempt_id)
        if cached is None:
            raise create_error
        return AIExplanationResponse(
            attempt_id=attempt_id,
            cached=True,
            model=cached["model"],
            explanation=_validated_cached_content(cached["content"]),
        )

    return AIExplanationResponse(
        attempt_id=attempt_id,
        cached=False,
        model=OPENAI_MODEL or "",
        explanation=explanation,
    )
