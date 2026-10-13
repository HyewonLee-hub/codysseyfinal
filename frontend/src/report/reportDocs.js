// PDF 보고서 데이터 빌더. 실제 API 응답값만 옮기고, 응답에 없는 항목은 비워 둔다(렌더러가 줄·섹션을 생략).
// 진단·오늘의 학습·약점 학습 보고서가 같은 문서 형식(doc)을 쓴다.

function pad(n) { return String(n).padStart(2, '0') }

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value) {
  const d = toDate(value)
  return d ? `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}` : ''
}

function fileDate(value) {
  const d = toDate(value) ?? new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function percent(value) { return `${Math.round(value)}%` }

function subtypeTitle(item) { return [item.type_name, item.subtype_name].filter(Boolean).join(' · ') }

function toPerformanceRows(items) {
  return (items ?? []).map((item) => ({
    title: subtypeTitle(item),
    value: `${item.correct_count}/${item.attempted_count} · ${percent(item.accuracy)}`,
    pct: item.accuracy,
  }))
}

// /learning/recommendations의 top_traps에서 함정 이름을 찾는다(없으면 trap_id 그대로).
function trapNameMap(recommendations) {
  const names = {}
  for (const item of recommendations?.recommendations ?? []) {
    for (const trap of item.top_traps ?? []) if (trap.name) names[trap.trap_id] = trap.name
  }
  return names
}

function trapRowsFromCounts(trapCounts, recommendations) {
  const names = trapNameMap(recommendations)
  return (trapCounts ?? [])
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((trap) => ({ label: names[trap.trap_id] ? `${trap.trap_id} ${names[trap.trap_id]}` : trap.trap_id, count: trap.count }))
}

// 학습 기록 전체에서 추천 유형별로 반복된 함정(wrong_count)을 합산한다.
function trapRowsFromRecommendations(recommendations) {
  const totals = {}
  for (const item of recommendations?.recommendations ?? []) {
    for (const trap of item.top_traps ?? []) {
      const row = totals[trap.trap_id] ?? (totals[trap.trap_id] = { label: trap.name ? `${trap.trap_id} ${trap.name}` : trap.trap_id, count: 0, description: trap.description ?? '' })
      row.count += trap.wrong_count
    }
  }
  return Object.values(totals).sort((a, b) => b.count - a.count)
}

function recommendRows(recommendations, limit = 3) {
  return (recommendations?.recommendations ?? []).slice(0, limit).map((item) => ({
    title: subtypeTitle(item),
    detail: `누적 ${item.total_attempts}문제 중 ${item.correct_count}문제 정답 · 정답률 ${percent(item.accuracy)}`,
    reasons: item.reason ?? [],
    traps: (item.top_traps ?? []).map((trap) => trap.name || trap.trap_id),
  }))
}

function nextSteps({ recommendations, fallbackTitles = [] }) {
  const titles = (recommendations?.recommendations ?? []).slice(0, 3).map(subtypeTitle)
  const order = titles.length ? titles : fallbackTitles
  const steps = []
  if (order.length) steps.push(`취약 유형 반복에서 ${order.map((t) => `‘${t}’`).join(' → ')} 순서로 연습하세요.`)
  const topTrap = trapRowsFromRecommendations(recommendations)[0]
  if (topTrap) steps.push(`가장 많이 반복된 함정은 ${topTrap.label}(${topTrap.count}회)예요. 보기를 고르기 전에 이 함정인지 한 번 더 확인하세요.`)
  return steps
}

export function buildDiagnosticDoc({ report, userName, completedAt, recommendations }) {
  const recommended = report.recommended_learning_type
  const recommendedReasons = (recommendations?.recommendations ?? []).find((item) => item.subtype_id === recommended?.subtype_id)?.reason ?? []
  const traps = trapRowsFromRecommendations(recommendations)

  return {
    title: '진단 결과 보고서',
    subtitle: 'Diagnostic Report · TOEIC',
    filename: `TYPEUP_diagnostic_report_${fileDate(completedAt)}.pdf`,
    meta: [
      { label: '이름', value: userName },
      { label: '진단 일자', value: formatDateTime(completedAt) },
      { label: '진단 문항', value: report.total_count ? `${report.total_count}문항` : '' },
    ],
    kpis: [
      { label: '전체 정답률', value: percent(report.accuracy) },
      { label: '정답', value: `${report.correct_count} / ${report.total_count}` },
      { label: '예상 점수', value: report.estimated_score == null ? '' : String(report.estimated_score) },
    ],
    sections: [
      { kind: 'performance', title: '취약 유형', description: '정답률이 낮아 먼저 연습할 유형이에요.', rows: toPerformanceRows(report.weaknesses), tone: 'weak', empty: '이번 진단에서 분류된 취약 유형이 없어요.' },
      { kind: 'performance', title: '강점 유형', description: '안정적으로 풀고 있는 유형이에요.', rows: toPerformanceRows(report.strengths), tone: 'strong' },
      { kind: 'traps', title: '자주 걸린 함정 · 주의할 점', description: '지금까지의 학습 기록에서 반복된 오답 함정이에요.', rows: traps },
      { kind: 'recommend', title: '추천 학습', rows: recommended ? [{
        title: subtypeTitle(recommended),
        detail: `진단 ${recommended.attempted_count}문제 중 ${recommended.correct_count}문제 정답 · 정답률 ${percent(recommended.accuracy)}`,
        reasons: recommendedReasons,
        traps: [],
      }] : [] },
      { kind: 'steps', title: '다음 학습 방향', rows: nextSteps({ recommendations, fallbackTitles: (report.weaknesses ?? []).slice(0, 3).map(subtypeTitle) }) },
    ],
  }
}

const learningModeLabel = { general: '전체 유형', vocabulary: '어휘', grammar: '문법' }

export function buildLearningTestDoc({ report, userName, recommendations }) {
  const date = report.completed_at ?? report.started_at
  return {
    title: '학습 보고서',
    subtitle: `Learning Report · ${learningModeLabel[report.mode] ?? report.mode}`,
    filename: `TYPEUP_learning_report_${fileDate(date)}.pdf`,
    meta: [
      { label: '이름', value: userName },
      { label: '학습 일자', value: formatDateTime(date) },
      { label: '학습 유형', value: learningModeLabel[report.mode] ?? report.mode },
    ],
    kpis: [
      { label: '전체 정답률', value: percent(report.accuracy) },
      { label: '정답', value: `${report.correct_count} / ${report.total_questions}` },
    ],
    sections: [
      { kind: 'performance', title: '취약 유형', description: '이번 학습에서 다시 볼 유형이에요.', rows: toPerformanceRows(report.review_subtypes), tone: 'weak', empty: '이번 학습에서 다시 볼 유형이 분류되지 않았어요.' },
      { kind: 'performance', title: '강점 유형', description: '이번 학습에서 잘 푼 유형이에요.', rows: toPerformanceRows(report.strengths), tone: 'strong' },
      { kind: 'traps', title: '자주 걸린 함정 · 주의할 점', description: '이번 학습 오답에서 고른 함정이에요.', rows: trapRowsFromCounts(report.trap_counts, recommendations) },
      { kind: 'recommend', title: '추천 학습', description: '지금까지의 학습 기록으로 계산한 우선 연습 유형이에요.', rows: recommendRows(recommendations) },
      { kind: 'steps', title: '다음 학습 방향', rows: nextSteps({ recommendations, fallbackTitles: (report.review_subtypes ?? []).slice(0, 3).map(subtypeTitle) }) },
    ],
  }
}

export function buildWeakLearningDoc({ report, userName, recommendations }) {
  const date = report.completed_at ?? report.started_at
  return {
    title: '취약 유형 학습 보고서',
    subtitle: 'Weak-type Learning Report',
    filename: `TYPEUP_weak_learning_report_${fileDate(date)}.pdf`,
    meta: [
      { label: '이름', value: userName },
      { label: '학습 일자', value: formatDateTime(date) },
      { label: '학습 유형', value: subtypeTitle(report) },
    ],
    kpis: [
      { label: '전체 정답률', value: percent(report.accuracy) },
      { label: '정답', value: `${report.correct_count} / ${report.total_questions}` },
      { label: '최종 연속 정답', value: `${report.final_correct_streak}회` },
    ],
    sections: [
      { kind: 'traps', title: '자주 걸린 함정 · 주의할 점', description: '이번 학습 오답에서 고른 함정이에요.', rows: trapRowsFromCounts(report.trap_counts, recommendations) },
      { kind: 'recommend', title: '추천 학습', description: '지금까지의 학습 기록으로 계산한 우선 연습 유형이에요.', rows: recommendRows(recommendations) },
      { kind: 'steps', title: '다음 학습 방향', rows: nextSteps({ recommendations }) },
    ],
  }
}
