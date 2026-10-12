import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { formatSessionDate } from '../data/sessionReports.js'

export default function ReviewReportPage({ report, onHeaderNavigate, onBack, onRetake }) {
  const result = report?.resultData

  if (!result) return <div className="min-h-screen bg-canvas">
    <Header active="마이페이지" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,50px)] font-bold tracking-[-0.04em] text-ink">반복 학습 보고서</h1>
      <p role="status" className="mt-5 text-base leading-7 text-body">확인할 반복 학습 보고서가 없습니다.</p>
      <Button onClick={onBack} className="mt-8">마이페이지로 돌아가기</Button>
    </PageContainer>
  </div>

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="마이페이지" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[44px]">
      <p className="text-[16px] font-medium text-primary">마이페이지 / 나의 보고서</p>
      <h1 className="mt-[21px] text-[clamp(38px,5vw,50px)] leading-[1.2] font-bold tracking-[-0.05em] text-ink">반복 학습 보고서</h1>
      <p className="mt-2 text-[17px] text-body">
        <span>{result.typeTitle}</span><span aria-hidden="true"> · </span>
        <time dateTime={result.completedAt}>{formatSessionDate(result.completedAt)}</time>
      </p>

      <Card as="section" aria-labelledby="review-report-summary-title" className="mt-[35px] min-w-0 !rounded-[24px] !border-0 !bg-[#e9f0ff] !p-6 sm:!p-8">
        <h2 id="review-report-summary-title" className="text-[18px] font-bold text-primary">학습 결과</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="min-w-0"><dt className="text-[15px] text-body">전체 문제 수</dt><dd className="mt-2 text-[clamp(36px,7vw,52px)] leading-none font-bold text-ink">{result.total}</dd></div>
          <div className="min-w-0"><dt className="text-[15px] text-body">정답 수</dt><dd className="mt-2 text-[clamp(36px,7vw,52px)] leading-none font-bold text-ink">{result.correct}</dd></div>
          <div className="min-w-0"><dt className="text-[15px] text-body">정답률</dt><dd className="mt-2 text-[clamp(36px,7vw,52px)] leading-none font-bold text-primary">{result.accuracy}%</dd></div>
        </dl>
      </Card>

      <div className="mt-[48px] flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onBack} className="w-full sm:w-auto">마이페이지로 돌아가기</Button>
        <Button onClick={onRetake} className="w-full sm:w-auto">다시 학습하기</Button>
      </div>
    </PageContainer>
  </div>
}
