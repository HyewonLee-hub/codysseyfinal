"""Response schemas for a learner's report history."""

from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


class MyPageReportItemResponse(BaseModel):
    """A completed diagnostic or learning-session result for one learner."""

    report_type: Literal["diagnostic", "weak_learning", "learning_test"]
    session_id: str
    mode: Literal["diagnostic", "weak_learning", "general", "vocabulary", "grammar"]
    status: Literal["completed"]
    total_count: int
    correct_count: int
    accuracy: float
    created_at: str
    completed_at: str | None


class MyPageReportsResponse(BaseModel):
    """All completed reports owned by the authenticated learner."""

    items: list[MyPageReportItemResponse]


class ProfileUpdateRequest(BaseModel):
    """The mutable fields of the authenticated learner's profile."""

    name: str | None = None
    age: int | None = Field(default=None, gt=0)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return None

        normalized_value = value.strip()
        if not normalized_value:
            raise ValueError("name must not be blank.")
        return normalized_value

    @model_validator(mode="after")
    def require_at_least_one_field(self) -> "ProfileUpdateRequest":
        if self.name is None and self.age is None:
            raise ValueError("At least one profile field must be provided.")
        return self
