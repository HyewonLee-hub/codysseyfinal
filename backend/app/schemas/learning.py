"""Request and response schemas for weak-subtype learning endpoints."""

from typing import Literal

from pydantic import BaseModel

from app.schemas.diagnostic import ChoiceLabel


LearningTestMode = Literal["general", "vocabulary", "grammar"]


class PracticeChoiceResponse(BaseModel):
    label: str
    text: str


class WeakLearningItemResponse(BaseModel):
    id: str
    subtype_id: str
    part: str
    difficulty: str | None
    stem: str
    translation: str | None
    choices: list[PracticeChoiceResponse]


class WeakLearningSubmitRequest(BaseModel):
    learning_session_id: str
    question_id: str
    selected_choice: ChoiceLabel


class WeakLearningSubmitResponse(BaseModel):
    question_id: str
    subtype_id: str
    selected_choice: ChoiceLabel
    correct_choice: ChoiceLabel
    is_correct: bool
    trap_id: str | None = None
    correct_streak: int = 0
    is_completed: bool = False


class WeakLearningStartRequest(BaseModel):
    subtype_id: str


class WeakLearningStartResponse(BaseModel):
    learning_session_id: str
    subtype_id: str
    status: Literal["in_progress"]


class LearningTestStartRequest(BaseModel):
    mode: LearningTestMode


class LearningTestStartResponse(BaseModel):
    learning_session_id: str
    mode: LearningTestMode
    status: Literal["in_progress"]


class LearningTestItemResponse(BaseModel):
    id: str
    subtype_id: str
    part: str
    difficulty: str | None
    stem: str
    translation: str | None
    choices: list[PracticeChoiceResponse]


class LearningTestItemsResponse(BaseModel):
    learning_session_id: str
    mode: LearningTestMode
    items: list[LearningTestItemResponse]
    count: int


class LearningTestAnswerSubmission(BaseModel):
    question_id: str
    selected_choice: ChoiceLabel


class LearningTestSubmitRequest(BaseModel):
    learning_session_id: str
    answers: list[LearningTestAnswerSubmission]


class LearningTestItemGradingResult(BaseModel):
    question_id: str
    subtype_id: str
    selected_choice: ChoiceLabel
    correct_choice: ChoiceLabel
    is_correct: bool
    trap_id: str | None = None


class LearningTestSubmitResponse(BaseModel):
    learning_session_id: str
    mode: LearningTestMode
    total_questions: int
    correct_count: int
    accuracy: float
    results: list[LearningTestItemGradingResult]
    status: Literal["completed"]


class TrapCountResponse(BaseModel):
    trap_id: str
    count: int


class LearningTestSubtypePerformanceResponse(BaseModel):
    subtype_id: str
    subtype_name: str
    type_id: str
    type_name: str
    attempted_count: int
    correct_count: int
    accuracy: float


class LearningTestReportResponse(BaseModel):
    learning_session_id: str
    mode: LearningTestMode
    status: Literal["completed"]
    total_questions: int
    correct_count: int
    accuracy: float
    strengths: list[LearningTestSubtypePerformanceResponse]
    review_subtypes: list[LearningTestSubtypePerformanceResponse]
    trap_counts: list[TrapCountResponse]
    started_at: str
    completed_at: str | None


class WeakLearningReportResponse(BaseModel):
    learning_session_id: str
    subtype_id: str
    subtype_name: str
    type_id: str
    type_name: str
    status: str
    total_questions: int
    correct_count: int
    accuracy: float
    final_correct_streak: int
    trap_counts: list[TrapCountResponse]
    started_at: str
    completed_at: str | None
