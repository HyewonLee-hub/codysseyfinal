import api from './client.js'

const vocabularyQuizSessionStorageKey = 'toeic_vocabulary_quiz_session_id'
const vocabularyQuizResultsStorageKey = 'toeic_vocabulary_quiz_results'

export function getTodayWords() { return api.get('/words/today').then((response) => response.data) }
export function setWordSaved(wordId, isSaved) { return api.put(`/words/${wordId}/saved`, { is_saved: isSaved }).then((response) => response.data) }
export function setWordMemorized(wordId, isMemorized) { return api.put(`/words/${wordId}/memorized`, { is_memorized: isMemorized }).then((response) => response.data) }
export function getSavedWords() { return api.get('/words/saved').then((response) => response.data) }
export function startVocabularyQuiz() { return api.post('/words/quiz/start').then((response) => response.data) }
export function getVocabularyQuizItems(sessionId) { return api.get(`/words/quiz/${sessionId}/items`).then((response) => response.data) }
export function submitVocabularyQuiz(payload) { return api.post('/words/quiz/submit', payload).then((response) => response.data) }

export function saveVocabularyQuizSession(sessionId) {
  window.sessionStorage.setItem(vocabularyQuizSessionStorageKey, sessionId)
  window.sessionStorage.removeItem(vocabularyQuizResultsStorageKey)
}

export function getSavedVocabularyQuizSession() {
  return window.sessionStorage.getItem(vocabularyQuizSessionStorageKey)
}

export function clearVocabularyQuizSession() {
  window.sessionStorage.removeItem(vocabularyQuizSessionStorageKey)
  window.sessionStorage.removeItem(vocabularyQuizResultsStorageKey)
}

export function saveVocabularyQuizResults(result) {
  window.sessionStorage.setItem(vocabularyQuizResultsStorageKey, JSON.stringify(result))
}

export function getSavedVocabularyQuizResults() {
  try {
    const result = JSON.parse(window.sessionStorage.getItem(vocabularyQuizResultsStorageKey) ?? 'null')
    return result?.status === 'completed' ? result : null
  } catch {
    return null
  }
}

export function toVocabularyQuizQuestion(item) {
  return {
    id: item.word_id,
    category: '단어 뜻 고르기',
    question: item.word,
    options: item.choices.map((meaning) => ({ value: meaning, label: meaning })),
  }
}
