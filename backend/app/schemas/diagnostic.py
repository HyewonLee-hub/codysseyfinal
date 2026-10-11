"""Request and response schemas for free diagnostic endpoints."""

from typing import Literal

from pydantic import BaseModel


ChoiceLabel = Literal["A", "B", "C", "D"]


class DiagnosticChoiceResponse(BaseModel):
    label: str
    text: str


class DiagnosticItemResponse(BaseModel):
    id: str
    subtype_id: str
    part: str
    difficulty: str | None
    stem: str
    translation: str | None
    choices: list[DiagnosticChoiceResponse]


class DiagnosticItemsResponse(BaseModel):
    items: list[DiagnosticItemResponse]
    count: int


class DiagnosticAnswerSubmission(BaseModel):
    question_id: str
    selected_choice: ChoiceLabel


class DiagnosticSubmitRequest(BaseModel):
    answers: list[DiagnosticAnswerSubmission]


class DiagnosticItemGradingResult(BaseModel):
    question_id: str
    subtype_id: str
    selected_choice: ChoiceLabel
    correct_choice: ChoiceLabel
    is_correct: bool
    trap_id: str | None = None


class DiagnosticSubmitResponse(BaseModel):
    total_count: int
    correct_count: int
    accuracy: float
    results: list[DiagnosticItemGradingResult]
