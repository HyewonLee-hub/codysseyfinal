function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatSessionDate(isoDate, short = false) {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '—'
  const monthAndDay = `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
  return short ? monthAndDay : `${date.getFullYear()}.${monthAndDay}`
}

// 현재 탭에서 실제로 완료한 기록만 목록에 포함합니다.
export function createSessionReports({ diagnosisReport, studyReports = [], reviewRecords = [] }) {
  const reports = []

  if (diagnosisReport) reports.push({
    id: diagnosisReport.id,
    type: 'diagnosis',
    label: '무료진단',
    title: '무료진단 결과 · 화면 예시',
    createdAt: diagnosisReport.completedAt,
    path: '/diagnosis/result',
    resultData: diagnosisReport.resultData,
  })

  for (const studyResult of studyReports) {
    if (!studyResult.reportId) continue
    reports.push({
      id: studyResult.reportId,
      type: 'study',
      label: '오늘의 학습',
      title: '오늘의 학습 보고서',
      createdAt: studyResult.completedAt,
      path: `/mypage/reports/study/${studyResult.reportId}`,
      resultData: studyResult,
    })
  }

  for (const record of reviewRecords) reports.push({
    id: record.id,
    type: 'review',
    label: '반복 학습',
    title: `${record.typeTitle} 반복 학습 결과`,
    createdAt: record.completedAt,
    path: `/study/review/${record.typeId}`,
    resultData: record,
  })

  return reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
