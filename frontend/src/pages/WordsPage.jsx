import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import WordRow from '../components/domain/WordRow.jsx'
import { dailyWords } from '../data/dailyWords.js'

export default function WordsPage({ onHeaderNavigate, savedIds, memorizedIds, onToggleSaved, onToggleMemorized }) {
  const [viewedIds, setViewedIds] = useState(() => new Set())
  const [selectedId, setSelectedId] = useState(null)
  const [testNotice, setTestNotice] = useState(false)

  function selectWord(id) {
    setSelectedId(id)
    setViewedIds((previous) => new Set(previous).add(id))
  }

  return <div className="min-h-screen overflow-x-hidden bg-white">
    <Header active="오늘의 단어" onNavigate={onHeaderNavigate} />
    <main className="grid min-w-0 lg:min-h-[calc(100vh-84px)] lg:grid-cols-[minmax(280px,32vw)_minmax(0,1fr)] xl:grid-cols-[410px_minmax(0,1fr)]">
      <aside className="relative isolate overflow-hidden bg-warning-soft px-6 pb-14 pt-10 sm:px-10 lg:min-h-[816px] lg:pt-[69px] xl:px-[60px]" aria-labelledby="words-intro-title">
        <div className="relative z-10">
          <p className="text-[14px] font-bold text-warning">오늘의 단어</p>
          <h1 id="words-intro-title" className="mt-7 text-[clamp(44px,5vw,53px)] leading-[1.19] font-bold tracking-[-0.055em] text-ink">하루에<br />30개씩.</h1>
          <p className="mt-6 text-[16px] leading-[1.65] text-[#675c49]">뜻과 예문을 확인하고<br />다시 볼 단어를 저장하세요.</p>
          <div className="mt-10 border-t border-[#d7bd84] pt-7 lg:mt-[112px]">
            <p className="text-[15px] font-medium text-[#755a24]">오늘 확인한 단어</p>
            <p role="status" aria-live="polite" aria-label={`오늘 확인한 단어 ${viewedIds.size}개, 전체 ${dailyWords.length}개`} className="mt-3 text-[clamp(44px,5vw,56px)] leading-none font-bold tracking-[-0.05em] text-primary">{viewedIds.size} / {dailyWords.length}</p>
          </div>
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-[125px] -left-[165px] aspect-square w-[320px] shrink-0 rounded-full bg-[#ffe4ad]" />
      </aside>

      <section aria-labelledby="words-list-title" className="min-w-0 px-6 pb-12 pt-10 sm:px-10 lg:pr-[72px] lg:pl-[65px] lg:pt-[64px]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h2 id="words-list-title" className="text-[30px] leading-[1.25] font-bold tracking-[-0.04em] text-ink">오늘의 단어</h2>
          <p className="text-[15px] text-body">단어를 선택해 뜻과 예문을 확인하세요.</p>
        </div>
        <ol aria-label="오늘의 단어 30개" className="mt-[25px] max-h-[498px] min-w-0 overflow-y-auto border-t border-[#d6e0ea]">
          {dailyWords.map((word) => <WordRow
            key={word.id}
            word={word}
            selected={selectedId === word.id}
            saved={savedIds.has(word.id)}
            memorized={memorizedIds.has(word.id)}
            onSelect={selectWord}
            onSave={onToggleSaved}
            onMemorizedChange={onToggleMemorized}
          />)}
        </ol>
        <div className="mt-9 flex flex-col items-stretch gap-3 sm:items-end">
          <Button className="w-full sm:w-[185px]" onClick={() => setTestNotice(true)}>단어 테스트 시작</Button>
          {testNotice && <p role="status" className="text-sm text-body">단어 테스트 화면은 준비 중입니다.</p>}
        </div>
      </section>
    </main>
  </div>
}
