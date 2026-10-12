import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import QuestionCard from '../components/domain/QuestionCard.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { studyExams, studyQuestionsByType } from '../data/studyQuestions.js'

const cardStyles = {
  blue: { background: 'bg-[#deecff]', eyebrow: 'text-primary', ornament: 'border-[22px] border-[#bed9fb]' },
  green: { background: 'bg-[#ddf6e9]', eyebrow: 'text-success', ornament: 'bg-[#aee6cb]' },
  coral: { background: 'bg-[#ffebe5]', eyebrow: 'text-[#d8604d]', ornament: 'bg-[#ffc7b9]' },
}

export default function StudyPage({ onHeaderNavigate, onComplete, initialExamId = 'basic', completedAttempt }) {
  const [examId, setExamId] = useState(completedAttempt?.examId ?? initialExamId)
  const [currentIndex, setCurrentIndex] = useState(completedAttempt ? studyQuestionsByType[completedAttempt.examId].length - 1 : 0)
  const [selectedAnswer, setSelectedAnswer] = useState(completedAttempt ? completedAttempt.answers[studyQuestionsByType[completedAttempt.examId].at(-1).id] : null)
  const [answers, setAnswers] = useState(completedAttempt?.answers ?? {})
  const [error, setError] = useState('')
  const [switchNotice, setSwitchNotice] = useState('')
  const questions = studyQuestionsByType[examId]
  const question = questions[currentIndex]

  function selectExam(nextId) {
    if (nextId === examId) return
    const hadProgress = currentIndex > 0 || Boolean(selectedAnswer) || Object.keys(answers).length > 0
    setExamId(nextId)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswers({})
    setError('')
    setSwitchNotice(hadProgress ? '시험 유형을 변경해 이전 답안을 초기화하고 1번 문제부터 시작합니다.' : '선택한 시험의 1번 문제부터 시작합니다.')
  }

  function nextQuestion() {
    if (!selectedAnswer) {
      setError('답안을 선택한 뒤 다음 문제로 진행해 주세요.')
      return
    }
    const nextAnswers = { ...answers, [question.id]: selectedAnswer }
    setAnswers(nextAnswers)
    setError('')
    if (currentIndex === questions.length - 1) {
      if (Object.keys(nextAnswers).length === questions.length) onComplete?.({ examId, answers: nextAnswers })
      return
    }
    setCurrentIndex((index) => index + 1)
    setSelectedAnswer(null)
  }

  return <div className="min-h-screen overflow-x-hidden bg-[#fbfcff]">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <main>
      <PageContainer className="pb-10 pt-[24px] lg:!px-[64px]">
        <h1 className="text-[clamp(34px,5vw,42px)] leading-[1.2] font-bold tracking-[-0.05em] text-[#20232a]">오늘의 문제 풀기</h1>
        <p className="mt-[19px] text-[17px] text-[#687284]">세 가지 시험 중 하나를 골라 시작해 보세요.</p>
        <div aria-label="시험 유형 선택" className="mt-[46px] grid gap-5 md:grid-cols-3 lg:gap-6">
          {studyExams.map((exam) => {
            const chosen = examId === exam.id
            const tone = cardStyles[exam.tone]
            return <button key={exam.id} type="button" aria-pressed={chosen} onClick={() => selectExam(exam.id)} className={`relative isolate h-[157px] min-w-0 overflow-hidden rounded-[24px] border-2 px-[26px] py-[32px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-primary ${tone.background} ${chosen ? 'border-primary/50' : 'border-transparent'}`}>
              <span aria-hidden="true" className={`pointer-events-none absolute -top-[23px] -right-[23px] -z-10 aspect-square w-[118px] shrink-0 rounded-full ${tone.ornament}`} />
              <span className={`block text-[14px] font-bold ${tone.eyebrow}`}>{chosen ? '선택한 시험' : exam.eyebrow}</span>
              <span className="mt-[13px] block text-[27px] leading-[1.25] font-bold tracking-[-0.04em] text-[#20232a]">{exam.title}</span>
              <span className="mt-[8px] block text-[15px] text-[#647084]">{exam.description}</span>
            </button>
          })}
        </div>
        {switchNotice && <p role="status" className="mt-3 text-sm text-body">{switchNotice}</p>}
      </PageContainer>

      <section aria-label="오늘의 문제 풀이" className="min-h-[453px] bg-[linear-gradient(115deg,#f9fbff_0%,#eef4ff_55%,#f8faff_100%)]">
        <ProgressBar value={currentIndex + 1} max={questions.length} ariaLabel={`${studyExams.find((exam) => exam.id === examId).title} 진행률`} valueText={`${currentIndex + 1} / ${questions.length}문제`} trackClassName="!h-[2px] !rounded-none bg-[#e3e9f4]" fillClassName="!rounded-none" />
        <PageContainer className="pb-8 pt-[34px] lg:!px-[64px]">
          <QuestionCard key={question.id} variant="study" number={currentIndex + 1} total={questions.length} category={question.category} question={question.question} options={question.options} selected={selectedAnswer} onSelect={(value) => { setSelectedAnswer(value); setError('') }} name={question.id} error={error} />
          <div className="mt-[31px] flex justify-end">
            <Button onClick={nextQuestion} className="w-full sm:w-[218px]">{currentIndex === questions.length - 1 ? '시험 완료' : '다음 문제'}</Button>
          </div>
        </PageContainer>
      </section>
    </main>
  </div>
}
