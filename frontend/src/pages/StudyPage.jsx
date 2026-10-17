import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import QuestionCard from '../components/domain/QuestionCard.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { studyExams } from '../data/studyQuestions.js'
import { getReviewQuestions, getReviewType } from '../data/studyReview.js'
import { getLearningTestItems, saveLearningTestAttemptIds, saveLearningTestSession, startLearningTest, submitLearningTest, toBackendLearningMode, toFrontendLearningMode, toLearningTestQuestion } from '../api/learning.js'

const cardStyles = {
  blue: { background: 'bg-[#deecff]', eyebrow: 'text-primary', ornament: 'border-[22px] border-[#bed9fb]' },
  green: { background: 'bg-[#ddf6e9]', eyebrow: 'text-success', ornament: 'bg-[#aee6cb]' },
  coral: { background: 'bg-[#ffebe5]', eyebrow: 'text-[#d8604d]', ornament: 'bg-[#ffc7b9]' },
}

function getRequestErrorMessage(error, action) {
  if (error.response?.status === 401) return '로그인 후 학습을 계속할 수 있습니다.'
  if (error.response?.status === 404) return '학습 세션을 찾을 수 없습니다. 새 학습을 시작해주세요.'
  if (error.response?.status === 400) return action === 'submit' ? '답안을 제출할 수 없습니다. 학습을 다시 시작해주세요.' : '현재 학습 세션을 계속할 수 없습니다. 새 학습을 시작해주세요.'
  return '학습 데이터를 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
}

function LeaveLearningModal({ onCancel, onConfirm }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return <div role="presentation" className="fixed inset-0 z-50 flex items-end bg-[#20232a]/45 p-4 sm:items-center sm:justify-center" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="leave-learning-title" aria-describedby="leave-learning-description" className="w-full max-w-md rounded-[28px] bg-canvas p-6 shadow-xl sm:p-8">
      <h2 id="leave-learning-title" className="text-[24px] font-bold tracking-[-0.04em] text-ink">다른 학습을 선택할까요?</h2>
      <p id="leave-learning-description" className="mt-4 text-[16px] leading-7 text-body">현재 학습을 종료하고 다른 학습을 선택할까요?<br />현재 풀던 답안은 저장되지 않습니다.</p>
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel}>계속 학습하기</Button>
        <Button onClick={onConfirm}>다른 학습 선택</Button>
      </div>
    </section>
  </div>
}

function MockReviewStudyPage({ reviewType, reviewCompleted, onReviewComplete, onBackToReview, onHeaderNavigate }) {
  const questions = getReviewQuestions(reviewType.id)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const question = questions[currentIndex]
  const reviewIsComplete = reviewCompleted?.typeId === reviewType.id

  function nextQuestion() {
    if (!selectedAnswer) { setError('답안을 선택한 뒤 다음 문제로 진행해 주세요.'); return }
    const nextAnswers = { ...answers, [question.id]: selectedAnswer }
    setAnswers(nextAnswers)
    setError('')
    if (currentIndex === questions.length - 1) { onReviewComplete?.({ typeId: reviewType.id, answers: nextAnswers }); return }
    setCurrentIndex((index) => index + 1)
    setSelectedAnswer(null)
  }

  return <div className="min-h-screen overflow-x-hidden bg-[#fbfcff]"><Header active="학습" onNavigate={onHeaderNavigate} /><main><PageContainer className="pb-10 pt-[24px] lg:!px-[64px]"><h1 className="text-[clamp(34px,5vw,42px)] leading-[1.2] font-bold tracking-[-0.05em] text-[#20232a]">{reviewType.title} 반복 학습</h1><p className="mt-[19px] text-[17px] text-[#687284]">{questions.length}문제를 풀며 선택한 유형을 다시 연습하세요.</p></PageContainer><section aria-label="반복 학습 문제 풀이" className="min-h-[453px] bg-[linear-gradient(115deg,#f9fbff_0%,#eef4ff_55%,#f8faff_100%)]"><ProgressBar value={currentIndex + 1} max={questions.length} ariaLabel={`${reviewType.title} 진행률`} valueText={`${currentIndex + 1} / ${questions.length}문제`} trackClassName="!h-[2px] !rounded-none bg-[#e3e9f4]" fillClassName="!rounded-none" /><PageContainer className="pb-8 pt-[34px] lg:!px-[64px]">{reviewIsComplete ? <div role="status" className="py-14"><h2 className="text-[29px] font-bold text-ink">반복 학습을 완료했습니다.</h2><p className="mt-5 text-[16px] text-body">{reviewCompleted.total}문제 중 {reviewCompleted.correct}문제를 맞혔습니다. 정답률 {reviewCompleted.accuracy}%</p><Button onClick={onBackToReview} className="mt-8">다른 유형 선택하기</Button></div> : <><QuestionCard key={question.id} variant="study" number={currentIndex + 1} total={questions.length} category={question.category} question={question.question} options={question.options} selected={selectedAnswer} onSelect={(value) => { setSelectedAnswer(value); setError('') }} name={question.id} error={error} /><div className="mt-[31px] flex justify-end"><Button onClick={nextQuestion} className="w-full sm:w-[218px]">{currentIndex === questions.length - 1 ? '학습 완료' : '다음 문제'}</Button></div></>}</PageContainer></section></main></div>
}

function LearningTestPage({ session, initialExamId = 'basic', onSessionStarted, onComplete, onResetSession, onHeaderNavigate }) {
  const [examId, setExamId] = useState(() => session ? toFrontendLearningMode(session.mode) : initialExamId)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(Boolean(session))
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false)
  const [error, setError] = useState('')
  const question = questions[currentIndex]

  useEffect(() => {
    if (!session) return undefined
    let isActive = true
    getLearningTestItems(session.learningSessionId)
      .then((response) => {
        if (!isActive) return
        const nextQuestions = response.items.map(toLearningTestQuestion)
        if (!nextQuestions.length) setError('학습 문항을 찾을 수 없습니다.')
        setQuestions(nextQuestions)
      })
      .catch((requestError) => { if (isActive) setError(getRequestErrorMessage(requestError, 'items')) })
      .finally(() => { if (isActive) setIsLoading(false) })
    return () => { isActive = false }
  }, [session])

  async function handleStart(exam) {
    if (isStarting || isSubmitting) return
    const backendMode = toBackendLearningMode(exam.id)
    if (!backendMode) return
    setExamId(exam.id)
    setError('')
    setIsStarting(true)
    try {
      const started = await startLearningTest(backendMode)
      const nextSession = { learningSessionId: started.learning_session_id, mode: started.mode }
      saveLearningTestSession(nextSession)
      onSessionStarted?.(nextSession)
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'start'))
      setIsStarting(false)
    }
  }

  async function handleNext() {
    if (isSubmitting) return
    if (!selectedAnswer) { setError('답안을 선택한 뒤 다음 문제로 진행해 주세요.'); return }
    const nextAnswers = { ...answers, [question.id]: selectedAnswer }
    setAnswers(nextAnswers)
    setError('')
    if (currentIndex < questions.length - 1) { setCurrentIndex((index) => index + 1); setSelectedAnswer(null); return }
    setIsSubmitting(true)
    try {
      const result = await submitLearningTest({ learning_session_id: session.learningSessionId, answers: Object.entries(nextAnswers).map(([questionId, selectedChoice]) => ({ question_id: questionId, selected_choice: selectedChoice })) })
      saveLearningTestAttemptIds(result.results)
      onComplete?.(session)
    } catch (requestError) {
      setError(getRequestErrorMessage(requestError, 'submit'))
      setIsSubmitting(false)
    }
  }

  return <div className="min-h-screen overflow-x-hidden bg-[#fbfcff]"><Header active="학습" onNavigate={onHeaderNavigate} /><main><PageContainer className="pb-10 pt-[24px] lg:!px-[64px]"><h1 className="text-[clamp(34px,5vw,42px)] leading-[1.2] font-bold tracking-[-0.05em] text-[#20232a]">오늘의 문제 풀기</h1><p className="mt-[19px] text-[17px] text-[#687284]">세 가지 시험 중 하나를 골라 시작해 보세요.</p><div aria-label="시험 유형 선택" className="mt-[46px] grid gap-5 md:grid-cols-3 lg:gap-6">{studyExams.map((exam) => { const chosen = examId === exam.id; const tone = cardStyles[exam.tone]; return <button key={exam.id} type="button" aria-pressed={chosen} onClick={() => handleStart(exam)} disabled={Boolean(session) || isStarting} className={`relative isolate h-[157px] min-w-0 overflow-hidden rounded-[24px] border-2 px-[26px] py-[32px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${tone.background} ${chosen ? 'border-primary/50' : 'border-transparent'}`}><span aria-hidden="true" className={`pointer-events-none absolute -top-[23px] -right-[23px] -z-10 aspect-square w-[118px] shrink-0 rounded-full ${tone.ornament}`} /><span className={`block text-[14px] font-bold ${tone.eyebrow}`}>{chosen ? session ? '진행 중인 시험' : '선택한 시험' : exam.eyebrow}</span><span className="mt-[13px] block text-[27px] leading-[1.25] font-bold tracking-[-0.04em] text-[#20232a]">{exam.title}</span><span className="mt-[8px] block text-[15px] text-[#647084]">{exam.description}</span></button> })}</div>{error && !session && <p role="alert" className="mt-4 text-sm text-error">{error}</p>}</PageContainer>{!session && isStarting && <PageContainer className="pb-12"><p role="status" className="text-base text-body">학습 문항을 준비하는 중입니다.</p></PageContainer>}{session && isLoading && <PageContainer className="pb-12"><p role="status" className="text-base text-body">학습 문항을 불러오는 중입니다.</p></PageContainer>}{session && !isLoading && !question && <PageContainer className="pb-12"><p role="alert" className="text-base text-error">{error || '학습 문항을 찾을 수 없습니다.'}</p><Button onClick={onResetSession} className="mt-5">새 학습 선택하기</Button></PageContainer>}{session && !isLoading && question && <section aria-label="오늘의 문제 풀이" className="min-h-[453px] bg-[linear-gradient(115deg,#f9fbff_0%,#eef4ff_55%,#f8faff_100%)]"><ProgressBar value={currentIndex + 1} max={questions.length} ariaLabel="학습 진행률" valueText={`${currentIndex + 1} / ${questions.length}문제`} trackClassName="!h-[2px] !rounded-none bg-[#e3e9f4]" fillClassName="!rounded-none" /><PageContainer className="pb-8 pt-[28px] lg:!px-[64px]"><div className="mb-5 flex justify-end"><Button variant="secondary" size="sm" onClick={() => setIsLeaveConfirmOpen(true)} disabled={isSubmitting}>다른 학습 선택</Button></div><QuestionCard key={question.id} variant="study" number={currentIndex + 1} total={questions.length} category={question.category} question={question.question} options={question.options} selected={selectedAnswer} onSelect={(value) => { setSelectedAnswer(value); setError('') }} name={question.id} error={error} /><div className="mt-[31px] flex justify-end"><Button onClick={handleNext} disabled={isSubmitting} className="w-full sm:w-[218px]">{isSubmitting ? '제출 중...' : currentIndex === questions.length - 1 ? '시험 완료' : '다음 문제'}</Button></div></PageContainer></section>}</main>{isLeaveConfirmOpen && <LeaveLearningModal onCancel={() => setIsLeaveConfirmOpen(false)} onConfirm={onResetSession} />}</div>
}

export default function StudyPage({ onHeaderNavigate, onComplete, initialExamId, learningTestSession, onSessionStarted, onResetSession, reviewTypeId, reviewCompleted, onReviewComplete, onBackToReview }) {
  const reviewType = getReviewType(reviewTypeId)
  if (reviewType) return <MockReviewStudyPage reviewType={reviewType} reviewCompleted={reviewCompleted} onReviewComplete={onReviewComplete} onBackToReview={onBackToReview} onHeaderNavigate={onHeaderNavigate} />
  return <LearningTestPage key={learningTestSession?.learningSessionId ?? 'new'} session={learningTestSession} initialExamId={initialExamId} onSessionStarted={onSessionStarted} onComplete={onComplete} onResetSession={onResetSession} onHeaderNavigate={onHeaderNavigate} />
}
