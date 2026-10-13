// PDF에 함께 넣을 기존 API 값(보고서 일자, 누적 추천·함정)을 모은다. 실패한 호출은 비워 두고 해당 항목만 생략한다.
import { getMyReports } from '../api/mypage.js'
import { getLearningRecommendations } from '../api/weakLearning.js'

export async function loadReportContext(sessionId) {
  const [reports, recommendations] = await Promise.allSettled([
    sessionId ? getMyReports() : Promise.resolve(null),
    getLearningRecommendations(),
  ])
  const item = reports.status === 'fulfilled' ? reports.value?.items?.find((report) => report.session_id === sessionId) : null
  return {
    completedAt: item ? item.completed_at ?? item.created_at : null,
    recommendations: recommendations.status === 'fulfilled' ? recommendations.value : null,
  }
}
