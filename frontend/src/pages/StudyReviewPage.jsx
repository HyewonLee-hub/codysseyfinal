import Button from '../components/common/Button.jsx'
import Card from '../components/common/Card.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import { reviewTypes } from '../data/studyReview.js'

export default function StudyReviewPage({ recentRecord, onHeaderNavigate, onStartType }) {
  return <div className="min-h-screen overflow-x-hidden bg-canvas">
    <Header active="학습" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="pb-16 pt-[68px]">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] lg:gap-10 xl:grid-cols-[450px_minmax(0,1fr)] xl:gap-[63px]">
        <section aria-labelledby="study-review-title" className="min-w-0">
          <p className="text-[14px] font-bold text-primary">취약 유형 반복</p>
          <h1 id="study-review-title" className="mt-[23px] text-[clamp(32px,4vw,52px)] leading-[1.24] font-bold tracking-[-0.055em] text-ink">틀린 유형을<br />다시 풀어보세요.</h1>
          <p className="mt-[25px] text-[17px] leading-[27px] text-body">다시 풀 유형을 선택해보세요.</p>
          <Card as="section" aria-label="최근 반복 학습" className="mt-12 min-h-[123px] w-full max-w-[360px] !rounded-[22px] !border-0 !bg-[#e7f4ec] !px-[31px] !py-[28px] lg:mt-[104px]">
            <p className="text-[14px] leading-[19px] text-success">최근 반복 학습{recentRecord ? ` · ${recentRecord.typeTitle}` : ''}</p>
            {recentRecord
              ? <p className="mt-[13px] text-[29px] leading-[35px] font-bold text-[#23866a]">정답률 {recentRecord.accuracy}%</p>
              : <p role="status" className="mt-[13px] text-[16px] leading-[25px] font-bold text-[#23866a]">아직 반복 학습 기록이 없습니다.</p>}
          </Card>
        </section>

        <div className="min-w-0 space-y-[22px] lg:pt-[8px]">
          {reviewTypes.map((type) => {
            const isVocabulary = type.tone === 'blue'
            return <Card key={type.id} as="section" aria-labelledby={`review-${type.id}-title`} className={`relative flex min-h-[270px] min-w-0 flex-col overflow-hidden !rounded-[24px] !border-0 !px-[36px] !pb-[28px] !pt-[32px] ${isVocabulary ? '!bg-[#e4efff]' : '!bg-[#fff0dc]'}`}>
              <span aria-hidden="true" className="pointer-events-none absolute -right-[108px] -top-[156px] aspect-square w-[260px] shrink-0 rounded-full bg-[rgba(255,255,255,0.53)]" />
              <p className={`relative text-[14px] leading-[19px] font-bold ${isVocabulary ? 'text-primary' : 'text-[#d66c53]'}`}>{type.label}</p>
              <h2 id={`review-${type.id}-title`} className="relative mt-[35px] text-[31px] leading-[37px] font-bold text-ink">{type.title}</h2>
              <p className="relative mt-[15px] text-[16px] leading-[24px] text-body">{type.description}</p>
              <Button onClick={() => onStartType(type.id)} aria-label={`${type.title} 이 유형 시작하기`} className={`relative mt-auto w-[192px] max-w-full !px-3 ${isVocabulary ? '' : '!bg-[#d66c53] hover:!bg-[#bd5a46] focus-visible:!outline-[#d66c53]'}`}>이 유형 시작하기</Button>
            </Card>
          })}
        </div>
      </div>
    </PageContainer>
  </div>
}
