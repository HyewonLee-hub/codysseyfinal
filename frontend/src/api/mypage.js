import api from './client.js'

const metadataByReport = {
  diagnostic: { type: 'diagnosis', label: '무료진단', title: '무료진단 결과' },
  weak_learning: { type: 'weak', label: '약점 학습', title: '취약 유형 학습 결과' },
  learning_test: { type: 'study', label: '오늘의 학습' },
}

const learningTitleByMode = {
  general: '전체 유형 학습 결과',
  vocabulary: '어휘 학습 결과',
  grammar: '문법 학습 결과',
}

export function getMyProfile() { return api.get('/mypage/profile').then((response) => response.data) }
export function updateMyProfile(payload) { return api.patch('/mypage/profile', payload).then((response) => response.data) }
export function getMyReports() { return api.get('/mypage/reports').then((response) => response.data) }

export function toMyPageReportViewModel(item) {
  const metadata = metadataByReport[item.report_type]
  const title = item.report_type === 'learning_test' ? learningTitleByMode[item.mode] : metadata?.title
  const path = item.report_type === 'diagnostic'
    ? `/mypage/reports/diagnostic/${item.session_id}`
    : item.report_type === 'weak_learning'
      ? `/mypage/reports/weak/${item.session_id}`
      : `/mypage/reports/learning/${item.mode}/${item.session_id}`

  return {
    id: item.session_id,
    type: metadata?.type ?? 'study',
    label: metadata?.label ?? item.report_type,
    title: title ?? item.mode,
    path,
    createdAt: item.completed_at ?? item.created_at,
    completedAt: item.completed_at,
    total: item.total_count,
    correct: item.correct_count,
    accuracy: item.accuracy,
  }
}
