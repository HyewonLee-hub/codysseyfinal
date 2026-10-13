import api from './client.js'

export function getAIExplanation(attemptId) {
  return api.post(`/ai/explanations/${attemptId}`).then((response) => response.data)
}
