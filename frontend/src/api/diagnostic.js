import api from './client.js'

const diagnosticSessionStorageKey = 'toeic_diagnostic_session_id'

export function getDiagnosticItems(limit = 20) {
  return api.get('/diagnostic/items', { params: { limit } }).then((response) => response.data)
}

export function submitDiagnostic(answers) {
  return api.post('/diagnostic/submit', { answers }).then((response) => response.data)
}

export function getDiagnosticReport(sessionId) {
  return api.get(`/diagnostic/${sessionId}/report`).then((response) => response.data)
}

export function saveDiagnosticSessionId(sessionId) {
  window.sessionStorage.setItem(diagnosticSessionStorageKey, sessionId)
}

export function getSavedDiagnosticSessionId() {
  return window.sessionStorage.getItem(diagnosticSessionStorageKey)
}

export function toDiagnosisQuestion(item, number) {
  return {
    id: item.id,
    number,
    category: [item.part, item.difficulty].filter(Boolean).join(' · '),
    question: item.stem,
    options: item.choices.map((choice) => ({
      value: choice.label,
      label: choice.text,
    })),
  }
}

function toPerformanceViewModel(performance, emptyTitle, emptyDescription, isPriority = false) {
  if (!performance) {
    return { title: emptyTitle, description: emptyDescription }
  }

  const accuracy = Math.round(performance.accuracy)
  const suffix = isPriority ? '해당 유형을 먼저 복습해 보세요.' : '안정적으로 풀고 있는 유형입니다.'

  return {
    title: `${performance.type_name} · ${performance.subtype_name}`,
    description: `${performance.attempted_count}문제 중 ${performance.correct_count}문제 정답 · 정답률 ${accuracy}%. ${suffix}`,
  }
}

export function toDiagnosisResultViewModel(report) {
  const priority = report.weaknesses[0] ?? report.recommended_learning_type

  return {
    expectedScore: report.estimated_score,
    recommendedStudy: report.recommended_learning_type
      ? `${report.recommended_learning_type.type_name} · ${report.recommended_learning_type.subtype_name}`
      : '추천 학습 유형을 분석 중입니다.',
    strength: toPerformanceViewModel(
      report.strengths[0],
      '확인된 강점이 없습니다',
      '현재 진단 결과만으로는 강점 유형을 분류하기 어렵습니다.',
    ),
    priority: toPerformanceViewModel(
      priority,
      '우선 연습 유형이 없습니다',
      '현재 진단 결과만으로는 우선 연습 유형을 분류하기 어렵습니다.',
      true,
    ),
  }
}
