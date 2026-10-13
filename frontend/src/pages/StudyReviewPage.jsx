import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { getLearningRecommendations, startWeakLearning, toRecommendationViewModel } from '../api/weakLearning.js'
import { startWrongReview } from '../api/learning.js'

function getRecommendationErrorMessage(error) {
  if (error.response?.status === 401) return '로그인 후 학습 추천을 확인할 수 있습니다.'
  return '학습 추천을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export default function StudyReviewPage({ onHeaderNavigate, onStartWeakSession, onStartWrongReview }) {
  const [recommendationData, setRecommendationData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [startingId, setStartingId] = useState(null)
  const [isStartingWrongReview, setIsStartingWrongReview] = useState(false)
  const [wrongReviewError, setWrongReviewError] = useState('')

  useEffect(() => {
    let isActive = true

    getLearningRecommendations()
      .then((response) => {
        if (isActive) setRecommendationData(response)
      })
      .catch((requestError) => {
        if (isActive) setError(getRecommendationErrorMessage(requestError))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function handleStart(subtypeId) {
    if (startingId) return
    setStartingId(subtypeId)
    setError('')

    try {
      const session = await startWeakLearning(subtypeId)
      onStartWeakSession?.({ learningSessionId: session.learning_session_id, subtypeId: session.subtype_id })
    } catch (requestError) {
      setError(requestError.response?.status === 401
        ? '로그인 후 약점 학습을 시작할 수 있습니다.'
        : '선택한 유형의 학습을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setStartingId(null)
    }
  }

  async function handleStartWrongReview() {
    if (isStartingWrongReview) return
    setIsStartingWrongReview(true)
    setWrongReviewError('')
    try {
      const session = await startWrongReview()
      onStartWrongReview?.(session.session_id)
    } catch (requestError) {
      if (requestError.response?.status === 400) setWrongReviewError('복습할 오답이 없습니다.')
      else if (requestError.response?.status === 401) setWrongReviewError('로그인 후 오답 복습을 시작할 수 있습니다.')
      else setWrongReviewError('오답 복습을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsStartingWrongReview(false)
    }
  }

  const recommendations = recommendationData?.recommendations.map(toRecommendationViewModel) ?? []
  const strengths = recommendationData?.strengths ?? []
  const summary = recommendationData?.summary

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[68px]">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-10 xl:grid-cols-[450px_minmax(0,1fr)] xl:gap-[63px]">
        <section aria-labelledby="study-review-title" className="min-w-0">
          <p className="text-[14px] font-bold text-primary">취약 유형 반복</p>
          <h1 id="study-review-title" className="mt-[23px] text-[clamp(32px,4vw,52px)] leading-[1.24] font-bold tracking-[-0.055em] text-ink">틀린 유형을<br />다시 풀어보세요.</h1>
          <p className="mt-[25px] text-[17px] leading-[27px] text-body">학습 기록을 바탕으로 추천된 유형을 선택해보세요.</p>
          <Card as="section" aria-label="학습 분석" className="mt-12 min-h-[123px] w-full max-w-[360px] !rounded-[22px] !border-0 !bg-[#e7f4ec] !px-[31px] !py-[28px] lg:mt-[104px]">
            <p className="text-[14px] leading-[19px] text-success">학습 분석</p>
            {isLoading
              ? <p role="status" className="mt-[13px] text-[16px] leading-[25px] font-bold text-[#23866a]">추천을 분석하고 있습니다.</p>
              : <p className="mt-[13px] text-[16px] leading-[25px] font-bold text-[#23866a]">{summary ? `${summary.total_attempts}회 풀이 · ${summary.analyzed_subtypes}개 유형 분석` : '분석 정보가 없습니다.'}</p>}
          </Card>
          {!isLoading && strengths.length > 0 && <p className="mt-5 max-w-[360px] text-sm leading-6 text-body">강점: {strengths.map((item) => `${item.type_name} · ${item.subtype_name}`).join(', ')}</p>}
          <div className="mt-6 max-w-[360px]">
            <Button onClick={handleStartWrongReview} disabled={isStartingWrongReview} className="w-full">{isStartingWrongReview ? '오답 복습 준비 중...' : '오답 복습 시작하기'}</Button>
            {wrongReviewError && <p role="alert" className="mt-3 text-sm text-error">{wrongReviewError}</p>}
          </div>
        </section>

        <div className="min-w-0 space-y-[22px] lg:pt-[8px]">
          {isLoading && <p role="status" className="text-[16px] text-body">추천 유형을 불러오는 중입니다.</p>}
          {!isLoading && error && <p role="alert" className="text-[16px] text-error">{error}</p>}
          {!isLoading && !error && recommendations.length === 0 && <Card as="section" className="min-h-[180px] !rounded-[24px] !border-0 !bg-[#e9f0ff] !p-8"><h2 className="text-[24px] font-bold text-ink">추천 유형이 없습니다.</h2><p className="mt-4 text-[16px] leading-7 text-body">아직 추천을 만들 만큼 학습 기록이 충분하지 않습니다.</p></Card>}
          {recommendations.map((recommendation, index) => {
            const isBlue = index % 2 === 0
            return <Card key={recommendation.id} as="section" aria-labelledby={`review-${recommendation.id}-title`} className={`relative flex min-h-[270px] min-w-0 flex-col overflow-hidden !rounded-[24px] !border-0 !px-[36px] !pb-[28px] !pt-[32px] ${isBlue ? '!bg-[#e4efff]' : '!bg-[#fff0dc]'}`}>
              <span aria-hidden="true" className="pointer-events-none absolute -right-[108px] -top-[156px] aspect-square w-[260px] shrink-0 rounded-full bg-[rgba(255,255,255,0.53)]" />
              <p className={`relative text-[14px] leading-[19px] font-bold ${isBlue ? 'text-primary' : 'text-[#d66c53]'}`}>우선순위 {recommendation.priorityScore}</p>
              <h2 id={`review-${recommendation.id}-title`} className="relative mt-[24px] text-[31px] leading-[37px] font-bold text-ink">{recommendation.title}</h2>
              <p className="relative mt-[12px] text-[16px] leading-[24px] text-body">정답률 {recommendation.accuracy}%</p>
              <p className="relative mt-3 text-sm leading-6 text-body">{recommendation.reason.join(' · ')}</p>
              {recommendation.topTraps.length > 0 && <p className="relative mt-2 text-sm text-body">반복 함정: {recommendation.topTraps.map((trap) => trap.displayName).join(', ')}</p>}
              <Button onClick={() => handleStart(recommendation.id)} disabled={Boolean(startingId)} aria-label={`${recommendation.title} 이 유형 시작하기`} className={`relative mt-auto w-[192px] max-w-full !px-3 ${isBlue ? '' : '!bg-[#d66c53] hover:!bg-[#bd5a46] focus-visible:!outline-[#d66c53]'}`}>{startingId === recommendation.id ? '시작 중...' : '이 유형 시작하기'}</Button>
            </Card>
          })}
        </div>
      </div>
    </PageContainer>
  </div>
}
