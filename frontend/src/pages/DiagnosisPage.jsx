import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'

const steps = [
  { number: '01', title: '유형 확인', description: '어휘와 문법의 여러 유형을 풉니다.' },
  { number: '02', title: '결과 보기', description: '강점과 취약 유형을 확인합니다.' },
  { number: '03', title: '반복 학습', description: '필요한 유형을 선택해 연습합니다.' },
]

export default function DiagnosisPage({ onHeaderNavigate }) {
  const [notice, setNotice] = useState(false)

  return <div className="min-h-screen bg-[#fbfcfd]">
    <Header active="무료진단" onNavigate={onHeaderNavigate} />
    <PageContainer as="main" className="relative pb-14 pt-12 sm:pt-[70px] lg:min-h-[816px] lg:pb-[60px]">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,720fr)_minmax(0,521fr)] lg:gap-[55px]">
        <section aria-labelledby="diagnosis-title" className="min-w-0 lg:min-h-[403px]">
          <p className="text-sm font-bold text-primary">무료진단</p>
          <h1 id="diagnosis-title" className="mt-[23px] text-[clamp(38px,5vw,55px)] leading-[1.2] font-bold tracking-[-0.055em] text-ink">현재 실력을<br />확인해 보세요.</h1>
          <p className="mt-[18px] text-[18px] leading-[1.7] text-body">20문제를 풀고 강점과 취약 유형을<br className="hidden sm:block" /> 결과에서 확인할 수 있어요.</p>
        </section>

        <section aria-label="진단 문제 수" className="relative aspect-[521/423] min-w-0 bg-[#e3edff] lg:-mt-5">
          <span className="absolute -top-[10.64%] left-[62.38%] aspect-square w-[42.23%] rounded-full bg-[#fff1d3]" aria-hidden="true" />
          <span className="absolute left-[1.54%] top-[68.09%] aspect-square w-[23.8%] rounded-full bg-[#dff4e9]" aria-hidden="true" />
          <strong className="absolute left-[18.23%] top-[22.22%] text-[clamp(72px,8vw,112px)] leading-none tracking-[-0.09em] text-primary">20</strong>
          <p className="absolute left-[19.77%] top-[53.9%] text-[clamp(15px,1.4vw,19px)] text-ink">문제 · 어휘와 문법</p>
        </section>
      </div>

      <section aria-labelledby="diagnosis-steps-title" className="mt-12 lg:-mt-[2px]">
        <h2 id="diagnosis-steps-title" className="sr-only">무료진단 진행 과정</h2>
        <ol className="grid gap-8 sm:grid-cols-3 sm:gap-[33px]">
          {steps.map(({ number, title, description }) => <li key={number} className="min-w-0 border-t border-[#cbd4e3] pt-[22px]">
            <span className="text-[13px] font-bold text-primary">{number}</span>
            <h3 className="mt-3 text-[22px] font-bold text-ink">{title}</h3>
            <p className="mt-[15px] text-[15px] leading-[22.5px] text-body">{description}</p>
          </li>)}
        </ol>
      </section>

      <div className="mt-12 flex flex-col items-stretch gap-3 sm:items-end lg:absolute lg:bottom-[60px] lg:right-[72px] lg:mt-0">
        <Button onClick={() => setNotice(true)} className="min-h-[52px] w-full px-8 text-[15px] sm:w-[185px]">진단 시작하기</Button>
        {notice && <p role="status" className="text-center text-sm text-body sm:text-right">진단 문제 화면은 준비 중입니다.</p>}
      </div>
    </PageContainer>
  </div>
}
