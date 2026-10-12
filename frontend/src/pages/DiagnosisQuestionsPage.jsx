import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import QuestionCard from '../components/domain/QuestionCard.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { diagnosisQuestions } from '../data/diagnosisQuestions.js'

const ordinalNames = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두', '열세', '열네', '열다섯', '열여섯', '열일곱', '열여덟', '열아홉', '스무']

export default function DiagnosisQuestionsPage({ onHeaderNavigate, onComplete, completedAnswers }) {
  const [currentIndex, setCurrentIndex] = useState(() => completedAnswers ? diagnosisQuestions.length - 1 : 0)
  const [selected, setSelected] = useState(() => completedAnswers?.[diagnosisQuestions.at(-1).id] ?? null)
  const [answers, setAnswers] = useState(() => completedAnswers ?? {})
  const [error, setError] = useState('')
  const question = diagnosisQuestions[currentIndex]
  const total = diagnosisQuestions.length
  const currentNumber = currentIndex + 1

  function handleNext() {
    if (!selected) {
      setError('답안을 선택한 뒤 다음 문제로 진행해 주세요.')
      return
    }

    const nextAnswers = { ...answers, [question.id]: selected }
    setAnswers(nextAnswers)
    setError('')

    if (currentNumber === total) {
      if (Object.keys(nextAnswers).length === total) onComplete?.(nextAnswers)
      return
    }

    setCurrentIndex((index) => index + 1)
    setSelected(null)
  }

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
          <QuestionCard key={question.id} variant="diagnosis" number={currentNumber} total={total} category={`${question.part} · ${question.format}`} question={question.question} options={question.options} selected={selected} onSelect={(value) => { setSelected(value); setError('') }} name={question.id} error={error} />
        </PageContainer>
      </div>

      <PageContainer className="flex justify-end pb-12 pt-12 lg:pt-[113px]">
        <Button onClick={handleNext} className="min-h-[52px] w-full px-8 text-[15px] sm:w-[185px]">{currentNumber === total ? '진단 완료' : '다음 문제'}</Button>
      </PageContainer>
    </main>
  </div>
}
