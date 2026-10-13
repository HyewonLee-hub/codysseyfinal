import api from './client.js'

const weakSessionStorageKey = 'toeic_weak_learning_session_id'
const weakSubtypeStorageKey = 'toeic_weak_subtype_id'
const weakLastAttemptStorageKey = 'toeic_weak_last_attempt_id'

export function getLearningRecommendations() {
  return api.get('/learning/recommendations').then((response) => response.data)
}

export function startWeakLearning(subtypeId) {
  return api.post('/learning/weak/start', { subtype_id: subtypeId }).then((response) => response.data)
}

export function getWeakLearningItem(subtypeId) {
  return api.get(`/learning/weak/${subtypeId}/item`).then((response) => response.data)
}

export function submitWeakLearningAnswer({ learningSessionId, questionId, selectedChoice }) {
  return api.post('/learning/weak/submit', {
    learning_session_id: learningSessionId,
    question_id: questionId,
    selected_choice: selectedChoice,
  }).then((response) => response.data)
}

export function getWeakLearningReport(learningSessionId) {
  return api.get(`/learning/weak/${learningSessionId}/report`).then((response) => response.data)
}

export function saveWeakLearningSession({ learningSessionId, subtypeId }) {
  window.sessionStorage.setItem(weakSessionStorageKey, learningSessionId)
  window.sessionStorage.setItem(weakSubtypeStorageKey, subtypeId)
  window.sessionStorage.removeItem(weakLastAttemptStorageKey)
}

export function getSavedWeakLearningSession() {
  const learningSessionId = window.sessionStorage.getItem(weakSessionStorageKey)
  const subtypeId = window.sessionStorage.getItem(weakSubtypeStorageKey)

  return learningSessionId && subtypeId ? { learningSessionId, subtypeId } : null
}

export function saveWeakLearningLastAttemptId(attemptId) {
  if (attemptId != null) window.sessionStorage.setItem(weakLastAttemptStorageKey, String(attemptId))
}

export function toWeakLearningQuestion(item) {
  return {
    id: item.id,
    category: [item.part, item.difficulty].filter(Boolean).join(' · '),
    question: item.stem,
    options: item.choices.map((choice) => ({ value: choice.label, label: choice.text })),
  }
}

export function toRecommendationViewModel(item) {
  return {
    id: item.subtype_id,
    title: `${item.type_name} · ${item.subtype_name}`,
    accuracy: Math.round(item.accuracy),
    priorityScore: item.priority_score,
    reason: item.reason,
    topTraps: (item.top_traps ?? []).map((trap) => ({
      trapId: trap.trap_id,
      displayName: trap.name || trap.trap_id,
    })),
  }
}
