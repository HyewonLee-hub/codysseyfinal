# API Overview

## Base URL and format

- Development base URL: `http://localhost:8000` (replace with the deployed backend URL in production).
- All request and response bodies use JSON unless an endpoint has no body.
- UUID-like values in examples are placeholders only.

## Authentication

Authenticated endpoints require the access token returned by `POST /auth/login`.

```http
Authorization: Bearer <access_token>
```

Do not send `learner_id` from the frontend. The backend derives the current learner from the Bearer token.

Missing, malformed, expired, or invalid tokens return:

```json
{
  "detail": "Invalid or expired authentication token."
}
```

An otherwise valid Auth user with no linked learner profile returns HTTP `500`:

```json
{
  "detail": "Unable to load user profile."
}
```

`refresh_token` is included in the login response, but **there is currently no refresh-token endpoint**.

## Common errors

- Pydantic request validation errors use FastAPI's standard HTTP `422` response.
- Router errors use `{ "detail": "..." }`.
- Session IDs are UUID strings. Endpoints that explicitly validate them return HTTP `400` with either `session_id must be a valid UUID.` or `learning_session_id must be a valid UUID.`.
- A caller attempting to access another learner's owned session/attempt generally receives the same HTTP `404` as for a missing resource.

## Shared response objects

### TOEIC question item

```json
{
  "id": "POS-01-01-p1",
  "subtype_id": "POS-01-01",
  "part": "PART 5",
  "difficulty": "하",
  "stem": "The manager _____ the revised proposal.",
  "translation": "관리자는 수정된 제안서를 승인했다.",
  "choices": [
    {"label": "A", "text": "approved"},
    {"label": "B", "text": "approval"},
    {"label": "C", "text": "approving"},
    {"label": "D", "text": "approves"}
  ]
}
```

Public item endpoints do not expose `is_correct`, `correct_choice`, or `trap_id`.

### Grading result

```json
{
  "question_id": "POS-01-01-p1",
  "attempt_id": 47,
  "subtype_id": "POS-01-01",
  "selected_choice": "B",
  "correct_choice": "A",
  "is_correct": false,
  "trap_id": "TR-01"
}
```

`trap_id` is `null` for a correct answer.

`attempt_id` is the generated `question_attempts.id`. Store it when an AI explanation action should be available for this result.

# Auth

## POST /auth/signup

### Auth

- Public

### Request

```json
{
  "name": "홍길동",
  "age": 25,
  "email": "user@example.com",
  "password": "password1234",
  "terms_agreed": true,
  "privacy_agreed": true
}
```

- `name`: required, trimmed, cannot be blank.
- `age`: required positive integer.
- `email`: required, trimmed/lowercased, valid email format.
- `password`: required, at least 8 characters.
- `terms_agreed` and `privacy_agreed`: both must be `true`.

### Response

HTTP `201`:

```json
{
  "learner_id": "11111111-1111-1111-1111-111111111111",
  "auth_user_id": "22222222-2222-2222-2222-222222222222",
  "name": "홍길동",
  "age": 25,
  "email": "user@example.com"
}
```

### Errors

- `422`: invalid request fields or agreement not `true`.
- `409`: `{ "detail": "Email is already registered." }`
- `500`: `{ "detail": "Unable to create account." }`

### Notes

- Passwords are sent only to Supabase Auth and are never returned or saved in `public.learners`.

## POST /auth/login

### Auth

- Public

### Request

```json
{
  "email": "user@example.com",
  "password": "password1234"
}
```

### Response

HTTP `200`:

```json
{
  "access_token": "<access_token>",
  "refresh_token": "<refresh_token>",
  "token_type": "bearer",
  "learner_id": "11111111-1111-1111-1111-111111111111",
  "auth_user_id": "22222222-2222-2222-2222-222222222222",
  "name": "홍길동",
  "age": 25,
  "email": "user@example.com"
}
```

### Errors

- `422`: invalid email format or blank password.
- `401`: `{ "detail": "Invalid email or password." }`
- `500`: `{ "detail": "Unable to complete login." }`

### Notes

- Use `access_token` in the Authorization header for authenticated APIs.
- There is no refresh endpoint yet.

## GET /auth/me

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{
  "learner_id": "11111111-1111-1111-1111-111111111111",
  "auth_user_id": "22222222-2222-2222-2222-222222222222",
  "name": "홍길동",
  "age": 25,
  "email": "user@example.com"
}
```

### Errors

- `401`: invalid or expired token.
- `500`: `{ "detail": "Unable to load user profile." }`

# Diagnostic

## GET /diagnostic/items

### Auth

- Public

### Request

- Query: `limit` optional integer, default `20`, minimum `1`.

### Response

HTTP `200`:

```json
{
  "items": [
    {
      "id": "POS-01-01-dg",
      "subtype_id": "POS-01-01",
      "part": "PART 5",
      "difficulty": "하",
      "stem": "The manager _____ the revised proposal.",
      "translation": "관리자는 수정된 제안서를 승인했다.",
      "choices": [
        {"label": "A", "text": "approved"},
        {"label": "B", "text": "approval"},
        {"label": "C", "text": "approving"},
        {"label": "D", "text": "approves"}
      ]
    }
  ],
  "count": 20
}
```

### Errors

- `422`: `limit` is less than 1 or not an integer.

### Notes

- Problems are randomized per request. The frontend should submit the exact IDs it displayed.

## POST /diagnostic/submit

### Auth

- Required

### Request

```json
{
  "answers": [
    {"question_id": "POS-01-01-dg", "selected_choice": "B"}
  ]
}
```

- `selected_choice` must be `A`, `B`, `C`, or `D`.

### Response

HTTP `200`:

```json
{
  "session_id": "33333333-3333-3333-3333-333333333333",
  "total_count": 20,
  "correct_count": 14,
  "accuracy": 70.0,
  "results": [
    {
      "question_id": "POS-01-01-dg",
      "attempt_id": 47,
      "subtype_id": "POS-01-01",
      "selected_choice": "B",
      "correct_choice": "A",
      "is_correct": false,
      "trap_id": "TR-01"
    }
  ]
}
```

### Errors

- `400`: empty answers, duplicate question IDs, missing/non-diagnostic questions; for example `At least one diagnostic answer is required.`
- `422`: invalid body or choice label.
- `500`: `{ "detail": "Unable to submit diagnostic." }`

### Notes

- The current learner becomes the session and attempt owner.
- Save `session_id` to load the report.

## GET /diagnostic/{session_id}/report

### Auth

- Required; caller must own the diagnostic session.

### Request

- Path: `session_id` UUID.

### Response

HTTP `200`:

```json
{
  "diagnostic_session_id": "33333333-3333-3333-3333-333333333333",
  "total_count": 20,
  "correct_count": 14,
  "accuracy": 70.0,
  "estimated_score": null,
  "strengths": [
    {"subtype_id": "POS-01-01", "subtype_name": "품사", "type_id": "POS-01", "type_name": "문법", "attempted_count": 2, "correct_count": 2, "accuracy": 100.0}
  ],
  "weaknesses": [
    {"subtype_id": "LXA-01-01", "subtype_name": "형용사", "type_id": "LXA-01", "type_name": "어휘", "attempted_count": 2, "correct_count": 0, "accuracy": 0.0}
  ],
  "recommended_learning_type": {"subtype_id": "LXA-01-01", "subtype_name": "형용사", "type_id": "LXA-01", "type_name": "어휘", "attempted_count": 2, "correct_count": 0, "accuracy": 0.0}
}
```

### Errors

- `400`: invalid UUID or report calculation input error.
- `404`: `{ "detail": "Diagnostic session not found." }` for missing/non-owned sessions; `{ "detail": "No attempts found for this diagnostic session." }` when the owned session has no attempts.
- `500`: `{ "detail": "Unable to retrieve diagnostic report." }`

# Learning

## GET /learning/weak/{subtype_id}/item

### Auth

- Public

### Request

- Path: `subtype_id`.

### Response

HTTP `200`: one public TOEIC question item (see [TOEIC question item](#toeic-question-item)).

### Errors

- `404`: `{ "detail": "No practice questions found for this subtype." }`

### Notes

- This only fetches a random practice item. It does not create a session or persist an attempt.

## POST /learning/weak/start

### Auth

- Required

### Request

```json
{"subtype_id": "POS-01-01"}
```

### Response

HTTP `200`:

```json
{
  "learning_session_id": "44444444-4444-4444-4444-444444444444",
  "subtype_id": "POS-01-01",
  "status": "in_progress"
}
```

### Errors

- `400`: unknown subtype or no practice questions; for example `Unknown subtype: POS-01-01`.
- `500`: `{ "detail": "Unable to start weak learning session." }`

### Notes

- Save `learning_session_id`; it is required for every weak-learning submit and report request.

## POST /learning/weak/submit

### Auth

- Required; caller must own the session.

### Request

```json
{
  "learning_session_id": "44444444-4444-4444-4444-444444444444",
  "question_id": "POS-01-01-p1",
  "selected_choice": "B"
}
```

### Response

HTTP `200`:

```json
{
  "question_id": "POS-01-01-p1",
  "attempt_id": 48,
  "subtype_id": "POS-01-01",
  "selected_choice": "B",
  "correct_choice": "A",
  "is_correct": false,
  "trap_id": "TR-01",
  "correct_streak": 1,
  "is_completed": false
}
```

### Errors

- `400`: invalid UUID, wrong session mode/status, or question subtype differs from the session subtype.
- `404`: `{ "detail": "Learning session not found." }` for missing/non-owned sessions.
- `422`: invalid choice label/body.
- `500`: `{ "detail": "Unable to grade weak learning answer." }`

### Notes

- Each submit stores an attempt for the same session.
- The session completes automatically when the latest two session attempts are both correct. Once completed, further submit requests return a `400` session-status error.

## GET /learning/weak/{learning_session_id}/report

### Auth

- Required; caller must own the session.

### Request

- Path: `learning_session_id` UUID.

### Response

HTTP `200`:

```json
{
  "learning_session_id": "44444444-4444-4444-4444-444444444444",
  "subtype_id": "POS-01-01",
  "subtype_name": "품사",
  "type_id": "POS-01",
  "type_name": "문법",
  "status": "completed",
  "total_questions": 3,
  "correct_count": 2,
  "accuracy": 66.67,
  "final_correct_streak": 2,
  "trap_counts": [{"trap_id": "TR-01", "count": 1}],
  "started_at": "2026-10-12T00:00:00+00:00",
  "completed_at": "2026-10-12T00:10:00+00:00"
}
```

### Errors

- `400`: invalid UUID or a session of another mode.
- `404`: missing/non-owned session or a session with no attempts.
- `500`: `{ "detail": "Unable to retrieve weak learning report." }`

### Notes

- In-progress sessions may also be reported; completion is not required for this endpoint.

## POST /learning/test/start

### Auth

- Required

### Request

```json
{"mode": "general"}
```

- `mode`: one of `general`, `vocabulary`, `grammar`.

### Response

HTTP `200`:

```json
{
  "learning_session_id": "55555555-5555-5555-5555-555555555555",
  "mode": "general",
  "status": "in_progress"
}
```

### Errors

- `422`: invalid mode/body.
- `400`: unsupported mode.
- `500`: `{ "detail": "Unable to start learning test session." }`

## GET /learning/test/{learning_session_id}/items

### Auth

- Required; caller must own the session.

### Request

- Path: `learning_session_id` UUID.

### Response

HTTP `200`:

```json
{
  "learning_session_id": "55555555-5555-5555-5555-555555555555",
  "mode": "general",
  "items": [{"id": "POS-01-01-p1", "subtype_id": "POS-01-01", "part": "PART 5", "difficulty": "하", "stem": "...", "translation": "...", "choices": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}]}],
  "count": 20
}
```

### Errors

- `400`: invalid UUID, non-`in_progress` session, or not a general-learning-test mode.
- `404`: `{ "detail": "Learning test session not found." }` for missing/non-owned sessions.
- `500`: `{ "detail": "Unable to retrieve learning test items." }`, including insufficient candidate data or invalid fixed assignment.

### Notes

- The first read randomly assigns and saves exactly 20 unique questions.
- Subsequent reads for the same session return the same 20 questions in the same order.

## POST /learning/test/submit

### Auth

- Required; caller must own the session.

### Request

```json
{
  "learning_session_id": "55555555-5555-5555-5555-555555555555",
  "answers": [
    {"question_id": "POS-01-01-p1", "selected_choice": "A"}
  ]
}
```

### Response

HTTP `200`:

```json
{
  "learning_session_id": "55555555-5555-5555-5555-555555555555",
  "mode": "general",
  "total_questions": 20,
  "correct_count": 15,
  "accuracy": 75.0,
  "results": [{"question_id": "POS-01-01-p1", "attempt_id": 49, "subtype_id": "POS-01-01", "selected_choice": "A", "correct_choice": "B", "is_correct": false, "trap_id": "TR-01"}],
  "status": "completed"
}
```

### Errors

- `400`: invalid UUID, completed/non-test session, empty answers, answer count other than 20, duplicate IDs, or submitted IDs not matching the fixed assignment.
- `404`: `{ "detail": "Learning test session not found." }` for missing/non-owned sessions.
- `422`: invalid choice/body.
- `500`: `{ "detail": "Unable to submit learning test." }`

### Notes

- Submit all 20 assigned IDs exactly once. Answer order may differ from item order.
- Successful submission stores attempts and completes the session.

## GET /learning/test/{learning_session_id}/report

### Auth

- Required; caller must own a completed test session.

### Request

- Path: `learning_session_id` UUID.

### Response

HTTP `200`:

```json
{
  "learning_session_id": "55555555-5555-5555-5555-555555555555",
  "mode": "general",
  "status": "completed",
  "total_questions": 20,
  "correct_count": 15,
  "accuracy": 75.0,
  "strengths": [{"subtype_id": "POS-01-01", "subtype_name": "품사", "type_id": "POS-01", "type_name": "문법", "attempted_count": 2, "correct_count": 2, "accuracy": 100.0}],
  "review_subtypes": [{"subtype_id": "LXA-01-01", "subtype_name": "형용사", "type_id": "LXA-01", "type_name": "어휘", "attempted_count": 2, "correct_count": 0, "accuracy": 0.0}],
  "trap_counts": [{"trap_id": "TR-01", "count": 2}],
  "started_at": "2026-10-12T00:00:00+00:00",
  "completed_at": "2026-10-12T00:20:00+00:00"
}
```

### Errors

- `400`: invalid UUID, non-test session, or session not completed.
- `404`: `{ "detail": "Learning test session not found." }` for missing/non-owned sessions.
- `500`: `{ "detail": "Unable to retrieve learning test report." }`

## POST /learning/wrong/start

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{"session_id": "66666666-6666-6666-6666-666666666666", "total_count": 8}
```

### Errors

- `400`: `{ "detail": "No wrong questions available for review." }`
- `500`: `{ "detail": "Unable to start wrong review." }`

### Notes

- Uses up to 20 questions whose newest learner attempt is wrong.

## GET /learning/wrong/{session_id}/items

### Auth

- Required; caller must own the wrong-review session.

### Request

- Path: `session_id` UUID.

### Response

HTTP `200`:

```json
{
  "session_id": "66666666-6666-6666-6666-666666666666",
  "total_count": 8,
  "items": [{"id": "POS-01-01-p1", "subtype_id": "POS-01-01", "part": "PART 5", "difficulty": "하", "stem": "...", "translation": "...", "choices": [{"label": "A", "text": "..."}, {"label": "B", "text": "..."}, {"label": "C", "text": "..."}, {"label": "D", "text": "..."}]}]
}
```

### Errors

- `400`: invalid UUID or non-wrong-review session.
- `404`: `{ "detail": "Wrong review session not found." }` for missing/non-owned sessions.
- `500`: `{ "detail": "Unable to retrieve wrong review items." }`

### Notes

- Items are fixed when the review starts.

## POST /learning/wrong/submit

### Auth

- Required; caller must own the wrong-review session.

### Request

```json
{
  "session_id": "66666666-6666-6666-6666-666666666666",
  "answers": [{"question_id": "POS-01-01-p1", "selected_choice": "A"}]
}
```

### Response

HTTP `200`:

```json
{
  "session_id": "66666666-6666-6666-6666-666666666666",
  "total_count": 8,
  "correct_count": 6,
  "accuracy": 75.0,
  "results": [{"question_id": "POS-01-01-p1", "attempt_id": 50, "subtype_id": "POS-01-01", "selected_choice": "A", "correct_choice": "A", "is_correct": true, "trap_id": null}],
  "status": "completed"
}
```

### Errors

- `400`: invalid UUID, session not in progress, empty/duplicate answers, or answers not matching all assigned IDs.
- `404`: `{ "detail": "Wrong review session not found." }` for missing/non-owned sessions.
- `422`: invalid choice/body.
- `500`: `{ "detail": "Unable to submit wrong review." }`

## GET /learning/wrong/{session_id}/report

### Auth

- Required; caller must own a completed wrong-review session.

### Request

- Path: `session_id` UUID.

### Response

HTTP `200`:

```json
{
  "session_id": "66666666-6666-6666-6666-666666666666",
  "total_count": 8,
  "correct_count": 6,
  "accuracy": 75.0,
  "remaining_wrong_count": 2,
  "completed_at": "2026-10-12T00:20:00+00:00"
}
```

### Errors

- `400`: invalid UUID, another session mode, or session not completed.
- `404`: `{ "detail": "Wrong review session not found." }` for missing/non-owned sessions.
- `500`: `{ "detail": "Unable to retrieve wrong review report." }`

## GET /learning/recommendations

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{
  "recommendations": [
    {
      "subtype_id": "LXA-01-01",
      "subtype_name": "형용사",
      "type_id": "LXA-01",
      "type_name": "어휘",
      "priority_score": 82.5,
      "total_attempts": 5,
      "correct_count": 2,
      "wrong_count": 3,
      "accuracy": 40.0,
      "last_attempted_at": "2026-10-12T00:00:00+00:00",
      "last_is_correct": false,
      "recent_wrong_count": 2,
      "top_traps": [{"trap_id": "TR-09", "name": "혼동 선택지", "description": "...", "wrong_count": 2, "last_seen_at": "2026-10-12T00:00:00+00:00"}],
      "reason": ["최근 2회 연속 오답", "누적 정답률 40.00%", "TR-09 함정 2회 반복"]
    }
  ],
  "strengths": [
    {"subtype_id": "POS-01-01", "subtype_name": "품사", "type_id": "POS-01", "type_name": "문법", "total_attempts": 4, "correct_count": 4, "wrong_count": 0, "accuracy": 100.0, "last_attempted_at": "2026-10-12T00:00:00+00:00", "last_is_correct": true, "reason": ["누적 정답률 100.00%", "가장 최근 풀이가 정답"]}
  ],
  "summary": {"total_attempts": 42, "analyzed_subtypes": 8}
}
```

### Errors

- `500`: `{ "detail": "Unable to retrieve learning recommendations." }`

### Notes

- The backend analyzes the authenticated learner's cumulative `question_attempts`, not only the latest session.
- A subtype needs at least two attempts before it can become a recommendation or strength. New learners can receive empty arrays.

# Vocabulary

## GET /words/today

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{
  "date": "2026-10-12",
  "total_count": 30,
  "words": [{"id": "word-001", "word": "approve", "meaning": "승인하다", "example": "The manager approved the proposal.", "difficulty": "basic", "is_saved": true, "is_memorized": false}]
}
```

### Errors

- `500`: `{ "detail": "Unable to retrieve today's words." }`

### Notes

- Uses Korea Standard Time for `date`.
- Up to 30 words are fixed in daily assignments. Memorized words are hidden; eligible words can be assigned to fill the visible list again.

## PUT /words/{word_id}/saved

### Auth

- Required

### Request

- Path: `word_id`.

```json
{"is_saved": true}
```

### Response

HTTP `200`:

```json
{"word_id": "word-001", "is_saved": true, "is_memorized": false, "saved_at": "2026-10-12T00:00:00+00:00", "memorized_at": null}
```

### Errors

- `404`: `{ "detail": "Word not found." }`
- `422`: invalid body.
- `500`: `{ "detail": "Unable to update word state." }`

### Notes

- Sending `false` clears `saved_at` but preserves `is_memorized`.

## PUT /words/{word_id}/memorized

### Auth

- Required

### Request

- Path: `word_id`.

```json
{"is_memorized": true}
```

### Response

HTTP `200`:

```json
{"word_id": "word-001", "is_saved": true, "is_memorized": true, "saved_at": "2026-10-12T00:00:00+00:00", "memorized_at": "2026-10-12T01:00:00+00:00"}
```

### Errors

- `404`: `{ "detail": "Word not found." }`
- `422`: invalid body.
- `500`: `{ "detail": "Unable to update word state." }`

### Notes

- Sending `false` clears `memorized_at` but preserves `is_saved`.
- A word can be both saved and memorized; memorized words are excluded from today's visible list.

## GET /words/saved

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{
  "total_count": 1,
  "words": [{"id": "word-001", "word": "approve", "meaning": "승인하다", "example": "The manager approved the proposal.", "difficulty": "basic", "is_saved": true, "is_memorized": true, "saved_at": "2026-10-12T00:00:00+00:00", "memorized_at": "2026-10-12T01:00:00+00:00"}]
}
```

### Errors

- `500`: `{ "detail": "Unable to retrieve saved words." }`

### Notes

- An empty list is HTTP `200` with `total_count: 0`.
- Saved+memorized words remain included. Results are ordered by latest `saved_at` first.

## POST /words/quiz/start

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{"session_id": "77777777-7777-7777-7777-777777777777", "total_count": 10}
```

### Errors

- `400`: `{ "detail": "No saved words available for quiz." }`
- `500`: `{ "detail": "Unable to start vocabulary quiz." }`

### Notes

- Selects up to 10 saved words and stores a fixed quiz session.

## GET /words/quiz/{session_id}/items

### Auth

- Required; caller must own the quiz session.

### Request

- Path: `session_id` UUID.

### Response

HTTP `200`:

```json
{
  "session_id": "77777777-7777-7777-7777-777777777777",
  "total_count": 10,
  "items": [{"word_id": "word-001", "word": "approve", "choices": ["승인하다", "배송하다", "예약하다", "채용하다"]}]
}
```

### Errors

- `400`: `{ "detail": "session_id must be a valid UUID." }`
- `404`: `{ "detail": "Vocabulary quiz session not found." }`
- `500`: `{ "detail": "Unable to retrieve vocabulary quiz items." }`

### Notes

- Correct meanings are not exposed in this endpoint. Items remain fixed for the session.

## POST /words/quiz/submit

### Auth

- Required; caller must own the quiz session.

### Request

```json
{
  "session_id": "77777777-7777-7777-7777-777777777777",
  "answers": [{"word_id": "word-001", "selected_meaning": "승인하다"}]
}
```

### Response

HTTP `200`:

```json
{
  "session_id": "77777777-7777-7777-7777-777777777777",
  "total_count": 10,
  "correct_count": 8,
  "accuracy": 80.0,
  "results": [{"word_id": "word-001", "word": "approve", "selected_meaning": "승인하다", "correct_meaning": "승인하다", "is_correct": true}],
  "status": "completed"
}
```

### Errors

- `400`: invalid UUID, non-in-progress session, empty/duplicate answers, or IDs not matching assigned words.
- `404`: `{ "detail": "Vocabulary quiz session not found." }`
- `422`: invalid body.
- `500`: `{ "detail": "Unable to submit vocabulary quiz." }`

# MyPage

## GET /mypage/profile

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{"learner_id": "11111111-1111-1111-1111-111111111111", "auth_user_id": "22222222-2222-2222-2222-222222222222", "name": "홍길동", "age": 25, "email": "user@example.com"}
```

### Errors

- `401`: invalid or expired token.
- `500`: `{ "detail": "Unable to load user profile." }`

## PATCH /mypage/profile

### Auth

- Required

### Request

```json
{"name": "새이름", "age": 26}
```

- Both fields are optional, but at least one is required.
- `name` is trimmed and cannot be blank.
- `age` must be a positive integer.
- `email` is read-only and is not accepted in this request schema.

### Response

HTTP `200`:

```json
{"learner_id": "11111111-1111-1111-1111-111111111111", "auth_user_id": "22222222-2222-2222-2222-222222222222", "name": "새이름", "age": 26, "email": "user@example.com"}
```

### Errors

- `422`: empty body, blank name, invalid age, or invalid request body.
- `500`: `{ "detail": "Unable to update user profile." }`

## GET /mypage/reports

### Auth

- Required

### Request

- No body.

### Response

HTTP `200`:

```json
{
  "items": [{"report_type": "learning_test", "session_id": "55555555-5555-5555-5555-555555555555", "mode": "general", "status": "completed", "total_count": 20, "correct_count": 15, "accuracy": 75.0, "created_at": "2026-10-12T00:00:00+00:00", "completed_at": "2026-10-12T00:20:00+00:00"}]
}
```

### Errors

- `500`: `{ "detail": "Unable to retrieve report history." }`

### Notes

- Returns completed, learner-owned diagnostic, weak-learning, and general learning-test reports with attempts.

# AI

## POST /ai/explanations/{attempt_id}

### Auth

- Required; caller must own the stored `question_attempts` row.

### Request

- Path: `attempt_id` integer.
- No body.

### Response

HTTP `200`:

```json
{
  "attempt_id": 123,
  "cached": false,
  "model": "<configured_model>",
  "explanation": {
    "summary": "정답은 문맥상 동사 형태가 필요합니다.",
    "correct_reason": "A는 주어와 문장 구조에 맞는 동사입니다.",
    "selected_choice_reason": "B는 명사이므로 빈칸의 자리와 맞지 않습니다.",
    "trap": {"code": "TR-01", "name": "품사 혼동", "explanation": "명사와 동사 형태를 혼동하기 쉬운 보기입니다."},
    "rule": "빈칸 앞뒤 문맥으로 필요한 품사를 먼저 판단합니다.",
    "next_tip": "보기 전에 빈칸에 필요한 품사를 먼저 표시하세요."
  }
}
```

### Errors

- `404`: `{ "detail": "Question attempt not found." }` for missing/non-owned attempts.
- `502`: `{ "detail": "AI explanation is temporarily unavailable." }` when the provider fails or returns invalid structured JSON.
- `500`: `{ "detail": "Unable to retrieve AI explanation." }` for retrieval/cache data errors.

### Notes

- The backend retrieves the stored attempt, question/choices, taxonomy/specs, and trap before generation.
- The second request for the same attempt returns cached content with `cached: true` and does not call the provider.

# Health

## GET /health

### Auth

- Public

### Response

HTTP `200`:

```json
{"ok": true, "message": "TOEIC AI backend is running"}
```

## GET /health/db

### Auth

- Public

### Response

HTTP `200`:

```json
{"ok": true, "data": []}
```

### Notes

- Reads `test_connection` from Supabase. Do not rely on the exact shape of `data` for product UI.

# Frontend flows

## Login flow

`POST /auth/signup` → `POST /auth/login` → store `access_token` → `GET /auth/me`

Use the returned access token for all authenticated requests. There is no refresh API yet.

## Diagnostic flow

`GET /diagnostic/items` → collect answers → `POST /diagnostic/submit` → save `session_id` → `GET /diagnostic/{session_id}/report`

## Weak learning flow

Choose a `subtype_id` from recommendations or diagnostic report → `POST /learning/weak/start` → `GET /learning/weak/{subtype_id}/item` → repeat `POST /learning/weak/submit` → `GET /learning/weak/{learning_session_id}/report`

The item endpoint takes a subtype, while submit/report use the learning session ID.

## General learning flow

`POST /learning/test/start` → `GET /learning/test/{learning_session_id}/items` → submit all 20 answers via `POST /learning/test/submit` → `GET /learning/test/{learning_session_id}/report`

## Wrong review flow

`POST /learning/wrong/start` → `GET /learning/wrong/{session_id}/items` → `POST /learning/wrong/submit` → `GET /learning/wrong/{session_id}/report`

## Vocabulary flow

`GET /words/today` → save/memorize state via PUT → `GET /words/saved` → `POST /words/quiz/start` → `GET /words/quiz/{session_id}/items` → `POST /words/quiz/submit`

## AI explanation flow

Question submission returns `attempt_id` with each TOEIC grading result → `POST /ai/explanations/{attempt_id}`

# Integration Gaps

1. **No refresh-token endpoint.** Login returns `refresh_token`, but the backend exposes no endpoint to exchange it for a new access token.
2. **No pagination/filter query parameters** for saved words, report history, or recommendations. Frontend lists must currently consume the complete response.
3. **Vocabulary quiz requires its dedicated database schema.** The quiz API depends on `vocabulary_quiz_*` tables; its migration must be applied in the target Supabase project before using quiz endpoints.
