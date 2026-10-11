import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import ResultSummary from '../components/domain/ResultSummary.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

export default function DiagnosisResultPage({ result, onHeaderNavigate, onStart }) {
  const [practiceNotice, setPracticeNotice] = useState(false)

  if (!result) return <div className="min-h-screen bg-[#fbfcfd]">
    <Header active="무료진단" onNavigate={onHeaderNavigate} className="[&>div]:min-h-[83px]" />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">진단 결과가 없습니다.</h1>
      <p role="status" className="mt-5 text-base leading-7 text-body">진단을 완료하면 결과를 확인할 수 있어요.</p>
      <Button onClick={onStart} className="mt-8">무료진단 시작하기</Button>
    </PageContainer>
  </div>

  return <div className="min-h-screen bg-[#fbfcfd]">
    <Header active="무료진단" onNavigate={onHeaderNavigate} className="[&>div]:min-h-[83px]" />
    <PageContainer as="main" className="grid gap-12 pb-16 pt-12 lg:grid-cols-[485px_minmax(0,1fr)] lg:gap-[68px] lg:pt-[68px]">
      <ResultSummary variant="diagnosis" result={result} />
      <section aria-labelledby="diagnosis-result-title" className="min-w-0 lg:pt-[6px]">
        <h1 id="diagnosis-result-title" className="text-[clamp(36px,5vw,45px)] leading-[54px] font-bold tracking-[-0.04em] text-ink">진단 결과</h1>
        <p className="mt-[18px] text-base leading-[19px] text-[#66788c]">강점은 유지하고, 취약한 유형을 먼저 연습하세요.</p>

        <div className="mt-[66px]">
          <section aria-labelledby="strength-title" className="border-t border-[#cdd8e4] pb-[29px] pt-[26px]">
            <p className="text-[13px] leading-[18px] font-bold text-[#16936b]">강점</p>
            <h2 id="strength-title" className="mt-[10px] text-[25px] leading-[30px] font-bold text-ink">{result.strength.title}</h2>
            <p className="mt-[10px] text-[15px] leading-[18px] text-[#65778a]">{result.strength.description}</p>
          </section>
          <section aria-labelledby="priority-title" className="border-t border-[#cdd8e4] pb-[29px] pt-[26px]">
            <p className="text-[13px] leading-[18px] font-bold text-[#d96c59]">우선 연습</p>
            <h2 id="priority-title" className="mt-[10px] text-[25px] leading-[30px] font-bold text-ink">{result.priority.title}</h2>
            <p className="mt-[10px] text-[15px] leading-[18px] text-[#65778a]">{result.priority.description}</p>
          </section>
        </div>

        <Button onClick={() => setPracticeNotice(true)} className="mt-[31px] min-h-[52px] w-full !px-2 text-[15px] whitespace-nowrap sm:w-[185px]">취약 유형 연습하기</Button>
        {practiceNotice && <p role="status" className="mt-4 text-sm text-body">취약 유형 학습 화면은 준비 중입니다.</p>}
        {result.source === 'figma-preview' && <p className="mt-5 text-xs text-muted">화면 확인용 예시 결과입니다. 실제 진단 분석 결과가 아닙니다.</p>}
      </section>
    </PageContainer>
  </div>
}
