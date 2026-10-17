import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import QuestionCard from '../components/domain/QuestionCard.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import {
  getDiagnosticItems,
  saveDiagnosticSessionId,
  submitDiagnostic,
  toDiagnosisQuestion,
} from '../api/diagnostic.js'

const ordinalNames = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두', '열세', '열네', '열다섯', '열여섯', '열일곱', '열여덟', '열아홉', '스무']

export default function DiagnosisQuestionsPage({ onHeaderNavigate, onComplete }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const question = questions[currentIndex]
  const total = questions.length
  const currentNumber = currentIndex + 1

  useEffect(() => {
    let isActive = true

    getDiagnosticItems(20)
      .then((response) => {
        if (!isActive) return
        setQuestions(response.items.map(toDiagnosisQuestion))
        setLoadError(response.items.length ? '' : '현재 진단 문항을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.')
      })
      .catch(() => {
        if (isActive) setLoadError('진단 문항을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  async function handleNext() {
    if (isSubmitting) return

    if (!selected) {
      setError('답안을 선택한 뒤 다음 문제로 진행해 주세요.')
      return
    }

    const nextAnswers = { ...answers, [question.id]: selected }
    setAnswers(nextAnswers)
    setError('')

    if (currentNumber === total) {
      if (Object.keys(nextAnswers).length !== total) return

      setIsSubmitting(true)
      try {
        const result = await submitDiagnostic(
          Object.entries(nextAnswers).map(([questionId, selectedChoice]) => ({
            question_id: questionId,
            selected_choice: selectedChoice,
          })),
        )
        saveDiagnosticSessionId(result.session_id)
        onComplete?.(result.session_id)
      } catch (submitError) {
        setError(submitError.response?.status === 401
          ? '로그인 후 진단 결과를 제출할 수 있습니다.'
          : '진단 결과를 제출하지 못했습니다. 잠시 후 다시 시도해주세요.')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    setCurrentIndex((index) => index + 1)
    setSelected(null)
  }

  if (isLoading) return <div className="min-h-screen bg-[#fbfcfd]">
    <Header active="무료진단" onNavigate={onHeaderNavigate} className="[&>div]:min-h-[83px]" />
    <PageContainer as="main" className="py-16 sm:py-20">
      <p role="status" className="text-base text-body">진단 문항을 불러오는 중입니다.</p>
    </PageContainer>
  </div>

  if (loadError || !question) return <div className="min-h-screen bg-[#fbfcfd]">
    <Header active="무료진단" onNavigate={onHeaderNavigate} className="[&>div]:min-h-[83px]" />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">진단 문항을 준비하지 못했습니다.</h1>
      <p role="status" className="mt-5 text-base leading-7 text-body">{loadError || '잠시 후 다시 시도해주세요.'}</p>
    </PageContainer>
  </div>

  return <div className="min-h-screen bg-[#fbfcfd]">
    <Header active="무료진단" onNavigate={onHeaderNavigate} className="[&>div]:min-h-[83px]" />
    <main>
      <PageContainer className="pb-[22px] pt-[55px] lg:h-[216px]">
        <p className="text-sm font-bold text-primary">무료진단 {String(currentNumber).padStart(2, '0')} / {total}</p>
        <h1 className="text-[clamp(34px,5vw,42px)] font-bold tracking-[-0.05em] text-ink">{ordinalNames[currentIndex]} 번째 문제</h1>
        <p className="mt-[13px] text-[15px] text-muted">빈칸에 들어갈 가장 알맞은 답을 선택하세요.</p>
        <ProgressBar value={currentNumber} max={total} ariaLabel="무료진단 진행률" valueText={`${currentNumber} / ${total}문제`} trackClassName="!h-[3px] !rounded-none bg-[#e4eafb]" fillClassName="min-w-[6%] !rounded-none" className="mt-[34px]" />
      </PageContainer>

      <div className="bg-[#f2f6ff] py-12">
        <PageContainer>
          <QuestionCard key={question.id} variant="diagnosis" number={currentNumber} total={total} category={question.category} question={question.question} options={question.options} selected={selected} onSelect={(value) => { setSelected(value); setError('') }} name={question.id} error={error} />
        </PageContainer>
      </div>

      <PageContainer className="flex justify-end pb-12 pt-12 lg:pt-[113px]">
        <Button onClick={handleNext} disabled={isSubmitting} className="min-h-[52px] w-full px-8 text-[15px] sm:w-[185px]">{isSubmitting ? '제출 중...' : currentNumber === total ? '진단 완료' : '다음 문제'}</Button>
      </PageContainer>
    </main>
  </div>
}
