import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { getSavedWords, setWordMemorized, setWordSaved } from '../api/vocabulary.js'

const filters = [{ id: 'all', label: '전체' }, { id: 'learning', label: '외우는 중' }, { id: 'memorized', label: '외웠어요' }]

function getErrorMessage(error) {
  if (error.response?.status === 401) return '로그인 후 저장한 단어를 확인할 수 있습니다.'
  return '저장한 단어를 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export default function SavedWordsPage({ onStartTest, onHeaderNavigate, onBack, onOpenWords }) {
  const [filter, setFilter] = useState('all')
  const [savedWords, setSavedWords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [isStartingQuiz, setIsStartingQuiz] = useState(false)
  const [quizError, setQuizError] = useState('')

  async function loadSavedWords() {
    setIsLoading(true)
    setError('')
    try {
      const response = await getSavedWords()
      setSavedWords(response.words)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true
    getSavedWords()
      .then((response) => { if (isActive) setSavedWords(response.words) })
      .catch((requestError) => { if (isActive) setError(getErrorMessage(requestError)) })
      .finally(() => { if (isActive) setIsLoading(false) })
    return () => { isActive = false }
  }, [])

  async function handleSaved(word) {
    if (updatingId) return
    setUpdatingId(word.id)
    setError('')
    try {
      await setWordSaved(word.id, false)
      await loadSavedWords()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleMemorized(word) {
    if (updatingId) return
    setUpdatingId(word.id)
    setError('')
    try {
      const state = await setWordMemorized(word.id, !word.is_memorized)
      setSavedWords((current) => current.map((item) => item.id === word.id ? { ...item, is_saved: state.is_saved, is_memorized: state.is_memorized } : item))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleStartQuiz() {
    if (isStartingQuiz) return
    setIsStartingQuiz(true)
    setQuizError('')
    try {
      await onStartTest?.()
    } catch (requestError) {
      setQuizError(requestError.response?.status === 400 ? '저장된 단어가 없어 테스트를 시작할 수 없습니다.' : '단어 테스트를 시작하지 못했습니다. 잠시 후 다시 시도해주세요.')
      setIsStartingQuiz(false)
    }
  }

  const visibleWords = savedWords.filter((word) => filter === 'all' || word.is_memorized === (filter === 'memorized'))
  return <div className="min-h-screen overflow-x-hidden bg-canvas"><Header active="마이페이지" onNavigate={onHeaderNavigate} /><PageContainer as="main" className="pb-16 pt-[44px]"><button type="button" onClick={onBack} className="rounded text-[16px] font-medium text-[#4169e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">마이페이지</button><span className="text-[16px] text-[#4169e1]"> / 저장한 단어</span><h1 className="mt-[21px] text-[clamp(38px,5vw,54px)] leading-[1.2] font-bold tracking-[-0.05em] text-ink">저장한 단어</h1><p className="mt-1 text-[20px] leading-7 text-[#667184]">다시 볼 단어를 모아 두었습니다.</p><div aria-label="저장한 단어 필터" className="mt-[38px] grid h-[54px] w-full max-w-[480px] grid-cols-3 gap-1 rounded-full bg-[#ebf0f8] p-1 lg:mt-[29px]">{filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`min-w-0 rounded-full text-[clamp(13px,3vw,17px)] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${filter === item.id ? 'bg-[#4169e1] text-white' : 'text-[#5a6475] hover:bg-white/60'}`}>{item.label}</button>)}</div>{isLoading && <p role="status" className="mt-[30px] text-base text-body">저장한 단어를 불러오는 중입니다.</p>}{!isLoading && error && <div className="mt-[30px]"><p role="alert" className="text-base text-error">{error}</p><Button variant="secondary" onClick={loadSavedWords} className="mt-4">다시 시도하기</Button></div>}{!isLoading && !error && (visibleWords.length ? <ul aria-label="저장한 단어 목록" className="mt-[30px] grid gap-4">{visibleWords.map((word, index) => { const memorized = word.is_memorized; return <li key={word.id} className="relative grid min-w-0 gap-x-4 gap-y-3 rounded-[16px] border border-[#dde3ec] bg-white px-6 py-5 sm:grid-cols-[40px_minmax(140px,1fr)_minmax(110px,0.75fr)] sm:items-center lg:min-h-[100px] lg:grid-cols-[48px_262px_174px_minmax(0,1fr)_160px] lg:items-start lg:gap-x-4 lg:py-0 lg:pr-[46px] lg:pl-[22px]"><span className="text-[16px] font-bold text-[#4169e1] lg:mt-[33px]">{String(index + 1).padStart(2, '0')}</span><strong className="min-w-0 break-words text-[26px] leading-[1.2] text-ink lg:mt-[20px]">{word.word}</strong><span className="min-w-0 break-words text-[19px] font-medium text-ink lg:mt-[25px]">{word.meaning}</span><span className="min-w-0 break-words text-[16px] leading-6 text-[#667184] sm:col-span-2 lg:col-span-1 lg:mt-[25px]">{word.example}</span><div className="flex flex-wrap items-center gap-2 sm:col-span-3 lg:absolute lg:right-[46px] lg:top-[24px] lg:w-[160px] lg:flex-col lg:items-stretch lg:gap-[2px]"><button type="button" disabled={updatingId === word.id} aria-pressed={memorized} aria-label={`${word.word} ${memorized ? '외웠어요' : '외우는 중'}, 상태 변경`} onClick={() => handleMemorized(word)} className={`min-h-[48px] rounded-full px-4 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:h-[48px] lg:!text-[16px] lg:!font-bold ${memorized ? 'bg-[#e9f6ed] text-[#26885a]' : 'bg-[#eef3ff] text-[#4169e1]'}`}>{memorized ? '외웠어요' : '외우는 중'}</button><button type="button" disabled={updatingId === word.id} onClick={() => handleSaved(word)} aria-label={`${word.word} 저장 해제`} className="rounded text-[13px] text-body underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:self-end lg:!text-[12px] lg:!leading-[14px]">저장 해제</button></div></li> })}</ul> : <div role="status" className="mt-[30px] rounded-[16px] border border-[#dde3ec] bg-white px-6 py-10 text-[16px] text-body"><p>{savedWords.length ? '이 상태에 해당하는 저장 단어가 없습니다.' : '아직 저장한 단어가 없습니다.'}</p>{!savedWords.length && <Button variant="secondary" onClick={onOpenWords} className="mt-5">오늘의 단어 보기</Button>}</div>)}<div className="mt-[44px] flex flex-col items-end gap-3"><Button size="lg" disabled={isStartingQuiz} onClick={handleStartQuiz} className="w-full !text-[18px] !font-bold sm:w-[268px]">{isStartingQuiz ? '테스트 준비 중...' : '단어 테스트 시작 →'}</Button>{quizError && <p role="alert" className="text-sm text-error">{quizError}</p>}</div></PageContainer></div>
}
