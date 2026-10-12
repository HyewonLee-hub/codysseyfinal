import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import DiagnosisPage from './pages/DiagnosisPage.jsx'
import DiagnosisQuestionsPage from './pages/DiagnosisQuestionsPage.jsx'
import DiagnosisResultPage from './pages/DiagnosisResultPage.jsx'
import WordsPage from './pages/WordsPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import StudyResultPage from './pages/StudyResultPage.jsx'
import StudyReviewPage from './pages/StudyReviewPage.jsx'
import MyPage from './pages/MyPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SavedWordsPage from './pages/SavedWordsPage.jsx'
import StudyReportPage from './pages/StudyReportPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import { diagnosisQuestions } from './data/diagnosisQuestions.js'
import { mockDiagnosisResult } from './data/mockDiagnosisResult.js'
import { calculateStudyResult } from './data/studyResult.js'
import { createReviewRecord, getReviewType } from './data/studyReview.js'
import { createSessionReports } from './data/sessionReports.js'

function hasCompleteDiagnosis(answers) {
  return Boolean(answers) && Object.keys(answers).length === diagnosisQuestions.length && diagnosisQuestions.every((question) => question.options.some((option) => option.value === answers[question.id]))
}

function toggleId(previous, id) {
  const next = new Set(previous)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [diagnosisAnswers, setDiagnosisAnswers] = useState(null)
  const [diagnosisReport, setDiagnosisReport] = useState(null)
  const [studyResult, setStudyResult] = useState(null)
  const [studyReports, setStudyReports] = useState([])
  const [studyInitialExamId, setStudyInitialExamId] = useState('basic')
  const [reviewRecords, setReviewRecords] = useState([])
  const [reviewCompleted, setReviewCompleted] = useState(null)
  const [savedWordIds, setSavedWordIds] = useState(() => new Set())
  const [memorizedWordIds, setMemorizedWordIds] = useState(() => new Set())
  const [profile, setProfile] = useState({ name: '', age: '' })
  const reports = createSessionReports({ diagnosisReport: hasCompleteDiagnosis(diagnosisAnswers) ? diagnosisReport : null, studyReports, reviewRecords })

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    document.title = `${path === '/support/faq' ? '자주 묻는 질문' : path.startsWith('/mypage/reports/study') ? '오늘의 학습 보고서' : path === '/mypage/profile' ? '내 정보' : path === '/mypage/words' ? '저장한 단어' : path === '/mypage' ? '나의 학습 기록' : path.startsWith('/study/review') ? '취약 유형 반복' : path === '/study/result' ? '학습 결과' : path === '/study' ? '오늘의 문제 풀기' : path === '/words' ? '오늘의 단어' : path === '/signup' ? '회원가입' : path === '/diagnosis/result' ? '무료진단 결과' : path === '/diagnosis/questions' ? '무료진단 문제' : path === '/diagnosis' ? '무료진단' : '로그인'} | TOEIC AI`
  }, [path])

  function navigate(event, nextPath) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleHeaderNavigate(item) {
    const nextPath = item === '무료진단' ? '/diagnosis' : item === '오늘의 단어' ? '/words' : item === '학습' ? '/study' : item === '마이페이지' ? '/mypage' : item === '고객센터' ? '/support/faq' : null
    if (!nextPath) return
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleStartDiagnosis() {
    setDiagnosisAnswers(null)
    setDiagnosisReport(null)
    if (window.location.pathname !== '/diagnosis/questions') window.history.pushState(null, '', '/diagnosis/questions')
    setPath('/diagnosis/questions')
  }

  function handleCompleteDiagnosis(answers) {
    if (!hasCompleteDiagnosis(answers)) return
    setDiagnosisAnswers(answers)
    setDiagnosisReport({ id: crypto.randomUUID(), completedAt: new Date().toISOString(), resultData: mockDiagnosisResult })
    if (window.location.pathname !== '/diagnosis/result') window.history.pushState(null, '', '/diagnosis/result')
    setPath('/diagnosis/result')
  }

  function handleCompleteStudy(attempt) {
    const result = calculateStudyResult(attempt.examId, attempt.answers)
    if (!result) return
    const completedResult = { ...result, reportId: crypto.randomUUID(), completedAt: new Date().toISOString() }
    setStudyResult(completedResult)
    setStudyReports((previous) => [completedResult, ...previous])
    setStudyInitialExamId(result.examId)
    if (window.location.pathname !== '/study/result') window.history.pushState(null, '', '/study/result')
    setPath('/study/result')
  }

  function handleRetakeStudy() {
    if (studyResult) setStudyInitialExamId(studyResult.examId)
    setStudyResult(null)
    if (window.location.pathname !== '/study') window.history.pushState(null, '', '/study')
    setPath('/study')
  }

  function handleOpenReview() {
    if (window.location.pathname !== '/study/review') window.history.pushState(null, '', '/study/review')
    setPath('/study/review')
  }

  function handleStartReview(typeId) {
    if (!getReviewType(typeId)) return
    setReviewCompleted(null)
    const nextPath = `/study/review/${typeId}`
    if (window.location.pathname !== nextPath) window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  function handleCompleteReview({ typeId, answers }) {
    const record = createReviewRecord(typeId, answers)
    if (!record) return
    const savedRecord = { ...record, id: crypto.randomUUID() }
    setReviewRecords((records) => [savedRecord, ...records])
    setReviewCompleted(savedRecord)
  }

  function handleOpenReport(report) {
    if (report.type === 'diagnosis' && diagnosisReport?.id !== report.id) return
    if (report.type === 'study' && !studyReports.some((item) => item.reportId === report.id)) return
    if (report.type === 'review') {
      const record = reviewRecords.find((item) => item.id === report.id)
      if (!record) return
      setReviewCompleted(record)
    }
    if (window.location.pathname !== report.path) window.history.pushState(null, '', report.path)
    setPath(report.path)
  }

  function handleStartVocabularyStudy() {
    setStudyInitialExamId('vocabulary')
    setStudyResult(null)
    if (window.location.pathname !== '/study') window.history.pushState(null, '', '/study')
    setPath('/study')
  }

  if (path === '/support/faq') return <FaqPage onHeaderNavigate={handleHeaderNavigate} />
  if (path === '/diagnosis/result') return <DiagnosisResultPage result={hasCompleteDiagnosis(diagnosisAnswers) ? mockDiagnosisResult : null} onHeaderNavigate={handleHeaderNavigate} onStart={() => handleHeaderNavigate('무료진단')} />
  if (path === '/diagnosis/questions') return <DiagnosisQuestionsPage onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteDiagnosis} completedAnswers={diagnosisAnswers} />
  if (path === '/diagnosis') return <DiagnosisPage onHeaderNavigate={handleHeaderNavigate} onStart={handleStartDiagnosis} />
  if (path === '/words') return <WordsPage onHeaderNavigate={handleHeaderNavigate} savedIds={savedWordIds} memorizedIds={memorizedWordIds} onToggleSaved={(id) => setSavedWordIds((current) => toggleId(current, id))} onToggleMemorized={(id) => setMemorizedWordIds((current) => toggleId(current, id))} />
  if (path === '/mypage') return <MyPage profile={profile} reports={reports} onHeaderNavigate={handleHeaderNavigate} onOpenReport={handleOpenReport} onSavedWords={() => { window.history.pushState(null, '', '/mypage/words'); setPath('/mypage/words') }} onEditProfile={() => { window.history.pushState(null, '', '/mypage/profile'); setPath('/mypage/profile') }} />
  if (path === '/mypage/reports/study' || path.startsWith('/mypage/reports/study/')) {
    const reportId = path.slice('/mypage/reports/study/'.length)
    const report = reports.find((item) => item.type === 'study' && item.id === reportId)
    return <StudyReportPage report={report} onHeaderNavigate={handleHeaderNavigate} onBack={() => handleHeaderNavigate('마이페이지')} onReview={handleOpenReview} />
  }
  if (path === '/mypage/profile') return <ProfilePage profile={profile} onSave={(nextProfile) => { setProfile(nextProfile); window.history.pushState(null, '', '/mypage'); setPath('/mypage') }} onCancel={() => { window.history.pushState(null, '', '/mypage'); setPath('/mypage') }} onHeaderNavigate={handleHeaderNavigate} onBack={() => handleHeaderNavigate('마이페이지')} />
  if (path === '/mypage/words') return <SavedWordsPage savedIds={savedWordIds} memorizedIds={memorizedWordIds} onToggleSaved={(id) => setSavedWordIds((current) => toggleId(current, id))} onToggleMemorized={(id) => setMemorizedWordIds((current) => toggleId(current, id))} onStartTest={handleStartVocabularyStudy} onHeaderNavigate={handleHeaderNavigate} onBack={() => handleHeaderNavigate('마이페이지')} onOpenWords={() => handleHeaderNavigate('오늘의 단어')} />
  if (path === '/study/result') return <StudyResultPage result={studyResult} onHeaderNavigate={handleHeaderNavigate} onStart={() => handleHeaderNavigate('학습')} onRetake={handleRetakeStudy} onReview={handleOpenReview} />
  if (path === '/study/review') return <StudyReviewPage recentRecord={reviewRecords[0] ?? null} onHeaderNavigate={handleHeaderNavigate} onStartType={handleStartReview} />
  if (path.startsWith('/study/review/')) {
    const typeId = path.slice('/study/review/'.length)
    if (getReviewType(typeId)) return <StudyPage key={typeId} reviewTypeId={typeId} reviewCompleted={reviewCompleted} onReviewComplete={handleCompleteReview} onBackToReview={handleOpenReview} onHeaderNavigate={handleHeaderNavigate} />
  }
  if (path === '/study') return <StudyPage onHeaderNavigate={handleHeaderNavigate} onComplete={handleCompleteStudy} initialExamId={studyInitialExamId} completedAttempt={studyResult} />
  if (path === '/signup') return <SignupPage onLogin={(event) => navigate(event, '/login')} onHeaderNavigate={handleHeaderNavigate} />
  return <LoginPage onSignUp={(event) => navigate(event, '/signup')} onHeaderNavigate={handleHeaderNavigate} />
}

export default App
