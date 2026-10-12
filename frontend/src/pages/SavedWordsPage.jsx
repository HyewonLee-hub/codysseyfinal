import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { dailyWords } from '../data/dailyWords.js'

const filters = [
  { id: 'all', label: '전체' },
  { id: 'learning', label: '외우는 중' },
  { id: 'memorized', label: '외웠어요' },
]

export default function SavedWordsPage({ savedIds, memorizedIds, onToggleSaved, onToggleMemorized, onStartTest, onHeaderNavigate, onBack, onOpenWords }) {
  const [filter, setFilter] = useState('all')
  const savedWords = dailyWords.filter((word) => savedIds.has(word.id))
  const visibleWords = savedWords.filter((word) => filter === 'all' || memorizedIds.has(word.id) === (filter === 'memorized'))

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="마이페이지" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[44px]">
      <button type="button" onClick={onBack} className="rounded text-[16px] font-medium text-[#4169e1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">마이페이지</button><span className="text-[16px] text-[#4169e1]"> / 저장한 단어</span>
      <h1 className="mt-[21px] text-[clamp(38px,5vw,54px)] leading-[1.2] font-bold tracking-[-0.05em] text-ink">저장한 단어</h1>
      <p className="mt-1 text-[20px] leading-7 text-[#667184]">다시 볼 단어를 모아 두었습니다.</p>

      <div aria-label="저장한 단어 필터" className="mt-[38px] grid h-[54px] w-full max-w-[480px] grid-cols-3 gap-1 rounded-full bg-[#ebf0f8] p-1">
        {filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`min-w-0 rounded-full text-[clamp(13px,3vw,17px)] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${filter === item.id ? 'bg-[#4169e1] text-white' : 'text-[#5a6475] hover:bg-white/60'}`}>{item.label}</button>)}
      </div>

      {visibleWords.length ? <ul aria-label="저장한 단어 목록" className="mt-[30px] grid gap-4">
        {visibleWords.map((word) => {
          const memorized = memorizedIds.has(word.id)
          return <li key={word.id} className="grid min-w-0 gap-x-4 gap-y-3 rounded-[16px] border border-[#dde3ec] bg-white px-6 py-5 sm:grid-cols-[40px_minmax(140px,1fr)_minmax(110px,0.75fr)] sm:items-center lg:min-h-[100px] lg:grid-cols-[48px_minmax(160px,265px)_minmax(130px,170px)_minmax(0,1fr)_160px] lg:gap-x-4">
            <span className="text-[16px] font-bold text-[#4169e1]">{String(word.number).padStart(2, '0')}</span>
            <strong className="min-w-0 break-words text-[26px] leading-[1.2] text-ink">{word.word}</strong>
            <span className="min-w-0 break-words text-[19px] font-medium text-ink">{word.meaning}</span>
            <span className="min-w-0 break-words text-[16px] leading-6 text-[#667184] sm:col-span-2 lg:col-span-1">{word.example}</span>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-3 lg:col-span-1 lg:flex-col lg:items-stretch">
              <button type="button" aria-pressed={memorized} aria-label={`${word.word} ${memorized ? '외웠어요' : '외우는 중'}, 상태 변경`} onClick={() => onToggleMemorized(word.id)} className={`min-h-[42px] rounded-full px-4 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${memorized ? 'bg-[#e9f6ed] text-[#26885a]' : 'bg-[#eef3ff] text-[#4169e1]'}`}>{memorized ? '외웠어요' : '외우는 중'}</button>
              <button type="button" onClick={() => onToggleSaved(word.id)} aria-label={`${word.word} 저장 해제`} className="rounded text-[13px] text-body underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">저장 해제</button>
            </div>
          </li>
        })}
      </ul> : <div role="status" className="mt-[30px] rounded-[16px] border border-[#dde3ec] bg-white px-6 py-10 text-[16px] text-body">
        <p>{savedWords.length ? '이 상태에 해당하는 저장 단어가 없습니다.' : '아직 저장한 단어가 없습니다.'}</p>
        {!savedWords.length && <Button variant="secondary" onClick={onOpenWords} className="mt-5">오늘의 단어 보기</Button>}
      </div>}

      <div className="mt-[44px] flex justify-end"><Button onClick={onStartTest} className="w-full text-[17px] sm:w-[268px]">단어 테스트 시작 →</Button></div>
    </PageContainer>
  </div>
}
