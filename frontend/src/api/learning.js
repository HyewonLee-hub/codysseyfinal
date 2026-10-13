import api from './client.js'

const learningTestSessionStorageKey = 'toeic_learning_test_session_id'
const learningTestModeStorageKey = 'toeic_learning_test_mode'
const learningTestAttemptIdsStorageKey = 'toeic_learning_test_attempt_ids'
const wrongReviewSessionStorageKey = 'toeic_wrong_review_session_id'
const wrongReviewResultsStorageKey = 'toeic_wrong_review_results'

const backendModeByFrontendMode = { basic: 'general', vocabulary: 'vocabulary', grammar: 'grammar' }
const frontendModeByBackendMode = { general: 'basic', vocabulary: 'vocabulary', grammar: 'grammar' }

export function toBackendLearningMode(frontendMode) { return backendModeByFrontendMode[frontendMode] }
export function toFrontendLearningMode(backendMode) { return frontendModeByBackendMode[backendMode] }
export function startLearningTest(mode) { return api.post('/learning/test/start', { mode }).then((response) => response.data) }
export function getLearningTestItems(sessionId) { return api.get(`/learning/test/${sessionId}/items`).then((response) => response.data) }
export function submitLearningTest(payload) { return api.post('/learning/test/submit', payload).then((response) => response.data) }
export function getLearningTestReport(sessionId) { return api.get(`/learning/test/${sessionId}/report`).then((response) => response.data) }
export function startWrongReview() { return api.post('/learning/wrong/start').then((response) => response.data) }
export function getWrongReviewItems(sessionId) { return api.get(`/learning/wrong/${sessionId}/items`).then((response) => response.data) }
export function submitWrongReview(payload) { return api.post('/learning/wrong/submit', payload).then((response) => response.data) }
export function getWrongReviewReport(sessionId) { return api.get(`/learning/wrong/${sessionId}/report`).then((response) => response.data) }

export function saveLearningTestSession({ learningSessionId, mode }) {
  window.sessionStorage.setItem(learningTestSessionStorageKey, learningSessionId)
  window.sessionStorage.setItem(learningTestModeStorageKey, mode)
  window.sessionStorage.removeItem(learningTestAttemptIdsStorageKey)
}

export function getSavedLearningTestSession() {
  const learningSessionId = window.sessionStorage.getItem(learningTestSessionStorageKey)
  const mode = window.sessionStorage.getItem(learningTestModeStorageKey)
  return learningSessionId && mode ? { learningSessionId, mode } : null
}

export function clearLearningTestSession() {
  window.sessionStorage.removeItem(learningTestSessionStorageKey)
  window.sessionStorage.removeItem(learningTestModeStorageKey)
  window.sessionStorage.removeItem(learningTestAttemptIdsStorageKey)
}

export function saveLearningTestAttemptIds(results) {
  const attemptIds = results.map((result) => result.attempt_id).filter((attemptId) => attemptId != null)
  window.sessionStorage.setItem(learningTestAttemptIdsStorageKey, JSON.stringify(attemptIds))
}

export function saveWrongReviewSession(sessionId) {
  window.sessionStorage.setItem(wrongReviewSessionStorageKey, sessionId)
  window.sessionStorage.removeItem(wrongReviewResultsStorageKey)
}

export function getSavedWrongReviewSession() {
  return window.sessionStorage.getItem(wrongReviewSessionStorageKey)
}

export function clearWrongReviewSession() {
  window.sessionStorage.removeItem(wrongReviewSessionStorageKey)
  window.sessionStorage.removeItem(wrongReviewResultsStorageKey)
}

export function saveWrongReviewResults(results) {
  window.sessionStorage.setItem(wrongReviewResultsStorageKey, JSON.stringify(results.map((result) => ({
    questionId: result.question_id,
    attemptId: result.attempt_id,
    isCorrect: result.is_correct,
    subtypeId: result.subtype_id,
    trapId: result.trap_id,
  }))))
}

export function getSavedWrongReviewResults() {
  try {
    const results = JSON.parse(window.sessionStorage.getItem(wrongReviewResultsStorageKey) ?? '[]')
    return Array.isArray(results) ? results : []
  } catch {
    return []
  }
}

export function toLearningTestQuestion(item) {
  return {
    id: item.id,
    subtypeId: item.subtype_id,
    part: item.part,
    difficulty: item.difficulty,
    category: [item.part, item.difficulty].filter(Boolean).join(' · '),
    question: item.stem,
    options: item.choices.map((choice) => ({ value: choice.label, label: choice.text })),
  }
}

export function toWrongReviewQuestion(item) {
  return toLearningTestQuestion(item)
}

export function toWrongReviewReportViewModel(report) {
  return {
    total: report.total_count,
    correct: report.correct_count,
    accuracy: report.accuracy,
    remainingWrongCount: report.remaining_wrong_count,
    completedAt: report.completed_at,
  }
}

function toPerformanceViewModel(performance, emptyTitle, emptyDescription) {
  if (!performance) return { title: emptyTitle, description: emptyDescription }
  return { title: `${performance.type_name} · ${performance.subtype_name}`, description: `${performance.attempted_count}문제 중 ${performance.correct_count}문제 정답 · 정답률 ${Math.round(performance.accuracy)}%` }
}

export function toLearningTestResultViewModel(report) {
  return {
    mode: report.mode,
    total: report.total_questions,
    correct: report.correct_count,
    incorrect: report.total_questions - report.correct_count,
    accuracy: report.accuracy,
    strength: toPerformanceViewModel(report.strengths[0], '확인된 강점이 없습니다', '이번 학습 결과만으로는 강점 유형을 분류하기 어렵습니다.'),
    review: toPerformanceViewModel(report.review_subtypes[0], '다시 볼 유형이 없습니다', '이번 학습에서 다시 볼 유형이 분류되지 않았습니다.'),
    trapCounts: report.trap_counts,
    startedAt: report.started_at,
    completedAt: report.completed_at,
  }
}
