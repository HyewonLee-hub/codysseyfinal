import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import QuestionCard from '../components/domain/QuestionCard.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import {
  getWeakLearningItem,
  saveWeakLearningLastAttemptId,
  submitWeakLearningAnswer,
  toWeakLearningQuestion,
} from '../api/weakLearning.js'

function getRequestErrorMessage(error, action) {
  if (error.response?.status === 401) return '로그인 후 약점 학습을 계속할 수 있습니다.'
  if (error.response?.status === 404) return action === 'item'
    ? '이 유형의 학습 문항을 찾을 수 없습니다.'
    : '진행 중인 약점 학습을 찾을 수 없습니다.'
  if (error.response?.status === 400) return '현재 학습 세션을 계속할 수 없습니다. 유형을 다시 선택해주세요.'
  return '약점 학습을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export default function WeakLearningPage({ session, onHeaderNavigate, onComplete, onBack }) {
  const [question, setQuestion] = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [correctStreak, setCorrectStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(Boolean(session))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!session) return undefined

    let isActive = true
    getWeakLearningItem(session.subtypeId)
      .then((item) => {
        if (isActive) setQuestion(toWeakLearningQuestion(item))
      })
      .catch((requestError) => {
        if (isActive) setError(getRequestErrorMessage(requestError, 'item'))
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [session])

  async function handleSubmit() {
    if (isSubmitting) return
    if (!selectedChoice) {
      setError('답안을 선택한 뒤 제출해 주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setNotice('')

    let answerWasSubmitted = false
    try {
      const result = await submitWeakLearningAnswer({
        learningSessionId: session.learningSessionId,
        questionId: question.id,
        selectedChoice,
      })
      answerWasSubmitted = true
      saveWeakLearningLastAttemptId(result.attempt_id)
      setCorrectStreak(result.correct_streak)

      if (result.is_completed) {
        onComplete?.()
        return
      }

      const nextItem = await getWeakLearningItem(session.subtypeId)
      setQuestion(toWeakLearningQuestion(nextItem))
      setSelectedChoice(null)
      setNotice(`다음 문제를 풀어보세요. 현재 연속 정답 ${result.correct_streak}회`)
    } catch (requestError) {
      if (answerWasSubmitted) setQuestion(null)
      setError(getRequestErrorMessage(requestError, 'submit'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) return <div className="min-h-screen bg-[#fbfcff]">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">진행 중인 약점 학습이 없습니다.</h1>
      <p className="mt-5 text-base leading-7 text-body">추천 유형을 선택한 뒤 학습을 시작해 주세요.</p>
      <Button onClick={onBack} className="mt-8">추천 유형 보기</Button>
    </PageContainer>
  </div>

  if (isLoading) return <div className="min-h-screen bg-[#fbfcff]">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20"><p role="status" className="text-base text-body">약점 학습 문항을 불러오는 중입니다.</p></PageContainer>
  </div>

  if (!question) return <div className="min-h-screen bg-[#fbfcff]">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">약점 학습을 계속할 수 없습니다.</h1>
      <p role="status" className="mt-5 text-base leading-7 text-body">{error || '잠시 후 다시 시도해주세요.'}</p>
      <Button onClick={onBack} className="mt-8">추천 유형 보기</Button>
    </PageContainer>
  </div>

  return <div className="min-h-screen overflow-x-hidden bg-[#fbfcff]">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <main>
      <PageContainer className="pb-10 pt-[24px] lg:!px-[64px]">
        <p className="text-[14px] font-bold text-primary">추천 약점 학습</p>
        <h1 className="mt-3 text-[clamp(34px,5vw,42px)] leading-[1.2] font-bold tracking-[-0.05em] text-[#20232a]">취약 유형 집중 학습</h1>
        <p className="mt-[19px] text-[17px] text-[#687284]">연속으로 2문제를 맞히면 학습이 완료됩니다.</p>
        <p className="mt-3 text-sm font-bold text-primary">현재 연속 정답 {correctStreak} / 2</p>
      </PageContainer>

      <section aria-label="약점 학습 문제 풀이" className="min-h-[453px] bg-[linear-gradient(115deg,#f9fbff_0%,#eef4ff_55%,#f8faff_100%)]">
        <PageContainer className="pb-8 pt-[34px] lg:!px-[64px]">
          <QuestionCard key={question.id} variant="diagnosis" number={1} total={1} category={question.category} question={question.question} options={question.options} selected={selectedChoice} onSelect={(value) => { setSelectedChoice(value); setError('') }} name={question.id} error={error} />
          {notice && <p role="status" className="mt-5 text-sm text-body">{notice}</p>}
          <div className="mt-[31px] flex justify-end"><Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-[218px]">{isSubmitting ? '제출 중...' : '답안 제출'}</Button></div>
        </PageContainer>
      </section>
    </main>
  </div>
}
