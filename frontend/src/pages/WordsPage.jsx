import { useEffect, useState } from 'react'
import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import WordRow from '../components/domain/WordRow.jsx'
import { getTodayWords, setWordMemorized, setWordSaved } from '../api/vocabulary.js'

function getErrorMessage(error) {
  if (error.response?.status === 401) return '로그인 후 오늘의 단어를 확인할 수 있습니다.'
  if (error.response?.status === 404) return '단어 정보를 찾을 수 없습니다.'
  return '단어 정보를 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
}

export default function WordsPage({ onHeaderNavigate, onStartQuiz }) {
  const [today, setToday] = useState(null)
  const [viewedIds, setViewedIds] = useState(() => new Set())
  const [selectedId, setSelectedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [isStartingQuiz, setIsStartingQuiz] = useState(false)
  const [quizError, setQuizError] = useState('')

  async function loadTodayWords() {
    setIsLoading(true)
    setError('')
    try {
      setToday(await getTodayWords())
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true
    getTodayWords()
      .then((response) => { if (isActive) setToday(response) })
      .catch((requestError) => { if (isActive) setError(getErrorMessage(requestError)) })
      .finally(() => { if (isActive) setIsLoading(false) })
    return () => { isActive = false }
  }, [])

  function selectWord(id) {
    setSelectedId(id)
    setViewedIds((previous) => new Set(previous).add(id))
  }

  async function handleSave(word) {
    if (updatingId) return
    setUpdatingId(word.id)
    setError('')
    try {
      const state = await setWordSaved(word.id, !word.is_saved)
      setToday((current) => current && { ...current, words: current.words.map((item) => item.id === word.id ? { ...item, is_saved: state.is_saved, is_memorized: state.is_memorized } : item) })
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
      await setWordMemorized(word.id, !word.is_memorized)
      await loadTodayWords()
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
      await onStartQuiz?.()
    } catch (requestError) {
      setQuizError(requestError.response?.status === 400 ? '저장된 단어가 없어 테스트를 시작할 수 없습니다.' : '단어 테스트를 시작하지 못했습니다. 잠시 후 다시 시도해주세요.')
      setIsStartingQuiz(false)
    }
  }

  const words = today?.words ?? []
  return <div className="min-h-screen overflow-x-hidden bg-white"><Header active="오늘의 단어" onNavigate={onHeaderNavigate} /><main className="grid min-w-0 lg:min-h-[calc(100vh-84px)] lg:grid-cols-[minmax(280px,32vw)_minmax(0,1fr)] xl:grid-cols-[410px_minmax(0,1fr)]"><aside className="relative isolate overflow-hidden bg-warning-soft px-6 pb-14 pt-10 sm:px-10 lg:min-h-[816px] lg:pt-[69px] xl:px-[60px]" aria-labelledby="words-intro-title"><div className="relative z-10"><p className="text-[14px] font-bold text-warning">오늘의 단어</p><h1 id="words-intro-title" className="mt-7 text-[clamp(44px,5vw,53px)] leading-[1.19] font-bold tracking-[-0.055em] text-ink">하루에<br />30개씩.</h1><p className="mt-6 text-[16px] leading-[1.65] text-[#675c49]">뜻과 예문을 확인하고<br />다시 볼 단어를 저장하세요.</p><div className="mt-10 border-t border-[#d7bd84] pt-7 lg:mt-[112px]"><p className="text-[15px] font-medium text-[#755a24]">오늘 확인한 단어</p><p role="status" aria-live="polite" aria-label={`오늘 확인한 단어 ${viewedIds.size}개, 전체 ${today?.total_count ?? 0}개`} className="mt-3 text-[clamp(44px,5vw,56px)] leading-none font-bold tracking-[-0.05em] text-primary">{viewedIds.size} / {today?.total_count ?? 0}</p></div></div><span aria-hidden="true" className="pointer-events-none absolute -bottom-[125px] -left-[165px] aspect-square w-[320px] shrink-0 rounded-full bg-[#ffe4ad]" /></aside><section aria-labelledby="words-list-title" className="min-w-0 px-6 pb-12 pt-10 sm:px-10 lg:pr-[72px] lg:pl-[65px] lg:pt-[64px]"><div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2"><h2 id="words-list-title" className="text-[30px] leading-[1.25] font-bold tracking-[-0.04em] text-ink">오늘의 단어</h2><p className="text-[15px] text-body">단어를 선택해 뜻과 예문을 확인하세요.</p></div>{isLoading && <p role="status" className="mt-8 text-base text-body">오늘의 단어를 불러오는 중입니다.</p>}{!isLoading && error && <div className="mt-8"><p role="alert" className="text-base text-error">{error}</p><Button variant="secondary" onClick={loadTodayWords} className="mt-4">다시 시도하기</Button></div>}{!isLoading && !error && !words.length && <p role="status" className="mt-8 text-base text-body">오늘 표시할 단어가 없습니다.</p>}{!isLoading && !error && words.length > 0 && <><ol aria-label="오늘의 단어" className="mt-[25px] max-h-[498px] min-w-0 overflow-y-auto border-t border-[#d6e0ea]">{words.map((word, index) => <WordRow key={word.id} word={{ ...word, number: index + 1 }} selected={selectedId === word.id} saved={word.is_saved} memorized={word.is_memorized} isUpdating={updatingId === word.id} onSelect={selectWord} onSave={() => handleSave(word)} onMemorizedChange={() => handleMemorized(word)} />)}</ol><div className="mt-9 flex flex-col items-stretch gap-3 sm:items-end"><Button className="w-full sm:w-[185px]" disabled={isStartingQuiz} onClick={handleStartQuiz}>{isStartingQuiz ? '테스트 준비 중...' : '단어 테스트 시작'}</Button>{quizError && <p role="alert" className="text-sm text-error">{quizError}</p>}</div></>}</section></main></div>
}
