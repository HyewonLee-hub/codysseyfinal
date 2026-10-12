import Button from '../components/common/Button.jsx'
import ResultSummary from '../components/domain/ResultSummary.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

export default function StudyResultPage({ result, onHeaderNavigate, onStart, onRetake }) {
  if (!result) return <div className="min-h-screen bg-canvas">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,45px)] font-bold tracking-[-0.04em] text-ink">학습 결과가 없습니다.</h1>
      <p role="status" className="mt-5 text-base leading-7 text-body">오늘의 문제 20개를 모두 풀면 결과를 확인할 수 있어요.</p>
      <Button onClick={onStart} className="mt-8">오늘의 문제 풀기</Button>
    </PageContainer>
  </div>

  const sections = [
    { id: 'study-strength-title', label: '잘한 유형', color: 'text-[#138a69]', ...result.strength },
    { id: 'study-review-title', label: '다시 볼 유형', color: 'text-accent-coral', ...result.review },
    { id: 'study-next-title', label: '다음 학습', color: 'text-[#836bdd]', ...result.nextLearning },
  ]

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[58px]">
      <p className="text-[14px] font-bold text-primary">학습 결과</p>
      <h1 className="mt-[13px] text-[clamp(36px,5vw,47px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink">오늘의 학습 결과</h1>
      <p className="mt-[15px] text-[16px] leading-[25px] text-body">정답과 유형별 결과를 확인하세요.</p>

      <div className="mt-[43px] grid gap-[58px] lg:grid-cols-[minmax(0,0.412fr)_minmax(0,0.588fr)] xl:grid-cols-[510px_minmax(0,1fr)]">
        <ResultSummary variant="study" result={result} />
        <section aria-labelledby="study-types-title" className="min-w-0 lg:pt-[10px]">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="study-types-title" className="text-[26px] font-bold text-ink">유형별 결과</h2>
            <p className="text-sm text-body">응시한 시험: {result.examTitle}</p>
          </div>
          <div className="mt-[18px]">
            {sections.map((item) => <section key={item.id} aria-labelledby={item.id} className="grid gap-3 border-t border-divider py-[23px] sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-0">
              <p className={`text-[14px] font-bold ${item.color}`}>{item.label}</p>
              <div className="min-w-0">
                <h3 id={item.id} className="break-words text-[22px] leading-[1.3] font-bold text-ink">{item.title}</h3>
                <p className="mt-[11px] break-words text-[16px] leading-[1.5] text-body">{item.description}</p>
              </div>
            </section>)}
          </div>
          <Button onClick={onRetake} className="mt-[35px] w-full sm:w-[192px]">오늘 다시 풀기</Button>
          <p className="mt-4 text-xs text-muted">Mock 문제 답안으로 계산한 결과입니다. 실제 TOEIC 점수나 AI 분석 결과가 아닙니다.</p>
        </section>
      </div>
    </PageContainer>
  </div>
}
