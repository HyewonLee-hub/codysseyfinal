import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { getWeakLearningReport } from '../api/weakLearning.js'
import { useAuth } from '../auth/useAuth.js'
import ReportPdfButton from '../report/ReportPdfButton.jsx'
import { loadReportContext } from '../report/reportContext.js'
import { buildWeakLearningDoc } from '../report/reportDocs.js'

function getReportErrorMessage(error) {
  if (error.response?.status === 401) return '로그인 후 학습 보고서를 확인할 수 있습니다.'
  if (error.response?.status === 404) return '학습 보고서를 찾을 수 없습니다.'
  if (error.response?.status === 400) return '현재 학습 세션의 보고서를 확인할 수 없습니다.'
  return '학습 보고서를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export default function WeakLearningReportPage({ session, onHeaderNavigate, onBack }) {
  const { user } = useAuth()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(session))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return undefined

    let isActive = true
    getWeakLearningReport(session.learningSessionId)
      .then((response) => {
        if (isActive) setReport(response)
      })
      .catch((requestError) => {
        if (isActive) setError(getReportErrorMessage(requestError))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [session])

  if (isLoading) return <div className="min-h-screen bg-canvas">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20"><p role="status" className="text-base text-body">약점 학습 보고서를 불러오는 중입니다.</p></PageContainer>
  </div>

  if (!report) return <div className="min-h-screen bg-canvas">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">약점 학습 보고서가 없습니다.</h1>
      <p role="status" className="mt-5 text-base leading-7 text-body">{error || '완료한 약점 학습을 확인할 수 있어요.'}</p>
      <Button onClick={onBack} className="mt-8">추천 유형 보기</Button>
    </PageContainer>
  </div>

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[58px]">
      <p className="text-[14px] font-bold text-primary">추천 약점 학습 결과</p>
      <h1 className="mt-[13px] text-[clamp(36px,5vw,47px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink">취약 유형 학습 결과</h1>
      <p className="mt-[15px] text-[16px] leading-[25px] text-body">{report.type_name} · {report.subtype_name}</p>

      <Card as="section" className="mt-[43px] grid gap-6 !rounded-[24px] !border-0 !bg-[#e9f0ff] !p-6 sm:grid-cols-3 sm:!p-8">
        <div><p className="text-[15px] text-body">전체 문제 수</p><p className="mt-2 text-[clamp(36px,7vw,52px)] leading-none font-bold text-ink">{report.total_questions}</p></div>
        <div><p className="text-[15px] text-body">정답 수</p><p className="mt-2 text-[clamp(36px,7vw,52px)] leading-none font-bold text-ink">{report.correct_count}</p></div>
        <div><p className="text-[15px] text-body">정답률</p><p className="mt-2 text-[clamp(36px,7vw,52px)] leading-none font-bold text-primary">{report.accuracy}%</p></div>
      </Card>

      <section className="mt-7 border-t border-divider py-6">
        <h2 className="text-[20px] font-bold text-ink">학습 진행</h2>
        <p className="mt-3 text-[16px] text-body">최종 연속 정답 {report.final_correct_streak}회</p>
        <p className="mt-2 text-[15px] text-muted">시작 {report.started_at}{report.completed_at ? ` · 완료 ${report.completed_at}` : ''}</p>
      </section>

      <section className="border-t border-divider py-6">
        <h2 className="text-[20px] font-bold text-ink">반복된 함정</h2>
        {report.trap_counts.length
          ? <ul className="mt-3 space-y-2 text-[16px] text-body">{report.trap_counts.map((trap) => <li key={trap.trap_id}>{trap.trap_id} · {trap.count}회</li>)}</ul>
          : <p className="mt-3 text-[16px] text-body">기록된 오답 함정이 없습니다.</p>}
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
        <Button onClick={onBack}>다른 추천 유형 보기</Button>
        <div><ReportPdfButton buildDoc={async () => {
          const { recommendations } = await loadReportContext()
          return buildWeakLearningDoc({ report, userName: user?.name, recommendations })
        }} /></div>
      </div>
    </PageContainer>
  </div>
}
