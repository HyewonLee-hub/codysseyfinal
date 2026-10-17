import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { formatSessionDate } from '../data/sessionReports.js'

export default function StudyReportPage({ report, onHeaderNavigate, onBack, onReview }) {
  const result = report?.resultData

  if (!result) return <div className="min-h-screen bg-canvas">
    <Header active="마이페이지" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="py-16 sm:py-20">
      <h1 className="text-[clamp(32px,5vw,50px)] font-bold tracking-[-0.04em] text-ink">오늘의 학습 보고서</h1>
      <p role="status" className="mt-5 text-base leading-7 text-body">확인할 학습 보고서가 없습니다.</p>
      <Button onClick={onBack} className="mt-8">마이페이지로 돌아가기</Button>
    </PageContainer>
  </div>

  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="마이페이지" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[44px]">
      <div className="text-[16px] font-medium text-[#4169e1]">
        <button type="button" onClick={onBack} className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">마이페이지</button>
        <span> / 나의 보고서</span>
      </div>
      <h1 className="mt-[21px] text-[clamp(38px,5vw,50px)] leading-[1.2] font-bold tracking-[-0.05em] text-[#20232a]">오늘의 학습 보고서</h1>
      <p className="mt-1 text-[17px] text-[#768395]"><time dateTime={report.createdAt}>{formatSessionDate(report.createdAt)}</time><span> · 학습 기록</span></p>

      <Card as="section" aria-labelledby="study-report-summary-title" className="relative mt-[35px] grid min-w-0 gap-5 !rounded-[24px] !border-0 !bg-[#e9f0ff] !p-6 sm:grid-cols-2 sm:!p-8 lg:h-[160px] lg:!p-0">
        <p className="sr-only">{result.total}문제 중 {result.correct}문제 정답, 정답률 {result.accuracy}%</p>
        <div className="min-w-0 lg:contents">
          <h2 id="study-report-summary-title" className="text-[18px] font-bold text-[#4169e1] lg:absolute lg:left-[32px] lg:top-[25px]">학습 결과</h2>
          <p aria-hidden="true" className="mt-2 whitespace-nowrap text-[clamp(42px,8vw,52px)] leading-none font-bold text-[#20232a] lg:absolute lg:left-[32px] lg:top-[60px] lg:mt-0 lg:text-[52px]">{result.correct} / {result.total}</p>
          <p aria-hidden="true" className="mt-2 text-[17px] font-medium text-[#667184] lg:absolute lg:left-[355px] lg:top-[87px] lg:mt-0">정답 수</p>
        </div>
        <div className="min-w-0 lg:contents">
          <p aria-hidden="true" className="whitespace-nowrap text-[clamp(52px,10vw,64px)] leading-none font-bold text-[#4169e1] lg:absolute lg:right-[126px] lg:top-[52px] lg:w-[250px] lg:text-[64px]">{result.accuracy}%</p>
          <p aria-hidden="true" className="mt-2 text-[17px] font-medium text-[#667184] lg:absolute lg:right-[56px] lg:top-[101px] lg:mt-0 lg:w-[120px]">정답률</p>
        </div>
      </Card>

      <div className="mt-[30px] grid gap-[22px] lg:grid-cols-2 xl:grid-cols-[618px_minmax(0,1fr)]">
        <Card as="section" aria-labelledby="study-report-strength-title" className="min-w-0 min-h-[220px] !rounded-[20px] !border-[#dde3ec] !p-[25px]">
          <h2 className="text-[20px] font-bold text-[#26885a]">잘한 유형</h2>
          <h3 id="study-report-strength-title" className="mt-[16px] break-words text-[30px] leading-[1.25] font-bold text-[#20232a]">{result.strength.title}</h3>
          <p className="mt-[19px] break-words text-[18px] leading-[1.5] text-[#667184]">{result.strength.description}</p>
        </Card>
        <Card as="section" aria-labelledby="study-report-review-title" className="min-w-0 min-h-[220px] !rounded-[20px] !border-[#dde3ec] !p-[25px]">
          <h2 className="text-[20px] font-bold text-[#dc855d]">다시 볼 유형</h2>
          <h3 id="study-report-review-title" className="mt-[16px] break-words text-[30px] leading-[1.25] font-bold text-[#20232a]">{result.review.title}</h3>
          <p className="mt-[19px] break-words text-[18px] leading-[1.5] text-[#667184]">{result.review.description}</p>
        </Card>
      </div>

      <div className="mt-[48px] flex justify-end"><Button size="lg" onClick={onReview} className="w-full !bg-[#4169e1] !text-[18px] !font-bold hover:!bg-primary-hover sm:w-[278px]">취약 유형 반복 →</Button></div>
    </PageContainer>
  </div>
}
