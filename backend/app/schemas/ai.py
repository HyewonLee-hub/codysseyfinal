"""Schemas for cached, retrieval-grounded AI answer explanations."""

from pydantic import BaseModel, Field


class AIExplanationTrap(BaseModel):
    code: str = Field(min_length=1)
    name: str = Field(min_length=1)
    explanation: str = Field(min_length=1)


class AIExplanationContent(BaseModel):
    summary: str = Field(min_length=1)
    correct_reason: str = Field(min_length=1)
    selected_choice_reason: str = Field(min_length=1)
    trap: AIExplanationTrap | None = None
    rule: str = Field(min_length=1)
    next_tip: str = Field(min_length=1)


class AIExplanationResponse(BaseModel):
    attempt_id: int
    cached: bool
    model: str
    explanation: AIExplanationContent
