import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import AIExplanationModal from '../components/domain/AIExplanationModal.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { getSavedWrongReviewResults, getWrongReviewReport, toWrongReviewReportViewModel } from '../api/learning.js'

function getErrorMessage(error) {
  if (error.response?.status === 401) return '로그인 후 오답 복습 결과를 확인할 수 있습니다.'
  if (error.response?.status === 404) return '오답 복습 결과를 찾을 수 없습니다.'
  if (error.response?.status === 400) return '완료된 오답 복습 결과만 확인할 수 있습니다.'
  return '오답 복습 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export default function WrongReviewResultPage({ sessionId, onHeaderNavigate, onBack, onRestart }) {
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(sessionId))
  const [error, setError] = useState('')
  const [explanationAttemptId, setExplanationAttemptId] = useState(null)
  const results = getSavedWrongReviewResults()

  useEffect(() => {
    if (!sessionId) return undefined
    let isActive = true
    getWrongReviewReport(sessionId)
      .then((response) => { if (isActive) setReport(toWrongReviewReportViewModel(response)) })
      .catch((requestError) => { if (isActive) setError(getErrorMessage(requestError)) })
      .finally(() => { if (isActive) setIsLoading(false) })
    return () => { isActive = false }
  }, [sessionId])

  if (isLoading) return <div className="min-h-screen bg-canvas"><Header active="학습" onNavigate={onHeaderNavigate} /><PageContainer as="main" className="py-16 sm:py-20"><p role="status" className="text-base text-body">오답 복습 결과를 불러오는 중입니다.</p></PageContainer></div>
  if (!report) return <div className="min-h-screen bg-canvas"><Header active="학습" onNavigate={onHeaderNavigate} /><PageContainer as="main" className="py-16 sm:py-20"><h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">오답 복습 결과가 없습니다.</h1><p role="status" className="mt-5 text-base leading-7 text-body">{error || '오답 복습을 완료하면 결과를 확인할 수 있어요.'}</p><Button onClick={onBack} className="mt-8">복습 화면으로 돌아가기</Button></PageContainer></div>

  const wrongResults = results.filter((result) => !result.isCorrect && result.attemptId != null)
  return <div className="min-h-screen overflow-x-hidden bg-canvas"><Header active="학습" onNavigate={onHeaderNavigate} /><PageContainer as="main" className="pb-16 pt-[58px]"><p className="text-[14px] font-bold text-primary">오답 복습 결과</p><h1 className="mt-[13px] text-[clamp(36px,5vw,47px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink">다시 확인할 내용을 정리했어요.</h1><Card as="section" className="mt-10 !rounded-[24px] !border-0 !bg-[#e9f0ff] !p-6 sm:!p-8"><dl className="grid gap-6 sm:grid-cols-4"><div><dt className="text-[15px] text-body">전체 문제</dt><dd className="mt-2 text-[38px] font-bold leading-none text-ink">{report.total}</dd></div><div><dt className="text-[15px] text-body">정답 수</dt><dd className="mt-2 text-[38px] font-bold leading-none text-ink">{report.correct}</dd></div><div><dt className="text-[15px] text-body">정답률</dt><dd className="mt-2 text-[38px] font-bold leading-none text-primary">{report.accuracy}%</dd></div><div><dt className="text-[15px] text-body">남은 오답</dt><dd className="mt-2 text-[38px] font-bold leading-none text-error">{report.remainingWrongCount}</dd></div></dl><p className="mt-6 text-xs text-muted">완료 {report.completedAt ?? '기록 없음'}</p></Card><section className="mt-11 max-w-2xl" aria-labelledby="wrong-ai-title"><h2 id="wrong-ai-title" className="text-[25px] font-bold text-ink">오답 AI 해설</h2><p className="mt-3 text-[16px] leading-7 text-body">틀린 문제의 선택 이유와 다음에 적용할 규칙을 확인하세요.</p>{wrongResults.length ? <ul className="mt-6 space-y-3">{wrongResults.map((result, index) => <li key={result.questionId} className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-divider bg-white px-5 py-4"><div><p className="font-bold text-ink">오답 문항 {index + 1}</p><p className="mt-1 text-sm text-body">유형 {result.subtypeId}</p></div><Button onClick={() => setExplanationAttemptId(result.attemptId)} className="w-full sm:w-auto">AI 해설 보기</Button></li>)}</ul> : <p className="mt-6 text-[16px] text-body">이번 복습에서 새로 틀린 문항이 없습니다.</p>}</section><div className="mt-12 flex flex-col gap-3 sm:flex-row"><Button variant="secondary" onClick={onBack}>복습 화면으로 돌아가기</Button><Button onClick={onRestart}>다시 복습하기</Button></div></PageContainer>{explanationAttemptId != null && <AIExplanationModal attemptId={explanationAttemptId} onClose={() => setExplanationAttemptId(null)} />}</div>
}
