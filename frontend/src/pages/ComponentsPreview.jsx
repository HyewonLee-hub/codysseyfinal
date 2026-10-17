import { useState } from 'react'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import Checkbox from '../components/common/Checkbox.jsx'
import Badge from '../components/common/Badge.jsx'
import Card from '../components/common/Card.jsx'
import SectionTitle from '../components/common/SectionTitle.jsx'
import ProgressBar from '../components/common/ProgressBar.jsx'
import InlineAlert from '../components/common/InlineAlert.jsx'
import Header from '../components/layout/Header.jsx'
import PageContainer from '../components/layout/PageContainer.jsx'
import QuestionCard from '../components/domain/QuestionCard.jsx'
import ResultSummary from '../components/domain/ResultSummary.jsx'

const options = [
  { value: 'A', label: 'review' }, { value: 'B', label: 'reviewed' },
  { value: 'C', label: 'reviewing' }, { value: 'D', label: 'to review' },
]

export default function ComponentsPreview() {
  const [active, setActive] = useState('학습')
  const [selected, setSelected] = useState('B')
  const [checked, setChecked] = useState(false)
  return <>
    <Header active={active} onNavigate={setActive} />
    <PageContainer as="main" className="space-y-12 py-12 sm:py-16">
      <SectionTitle as="h1" eyebrow="DESIGN SYSTEM / COMPONENTS" title="공통 컴포넌트 Preview" description="Figma에서 반복 확인한 UI와 주요 상태를 한곳에서 확인합니다." />
      <section aria-labelledby="buttons-title"><h2 id="buttons-title" className="mb-5 text-[22px] font-bold">버튼과 상태</h2><Card className="flex flex-wrap items-center gap-4"><Button>진단 시작하기</Button><Button variant="secondary">다시 보기</Button><Button variant="ghost">자세히 보기</Button><Button disabled>비활성 버튼</Button></Card></section>
      <section aria-labelledby="fields-title"><h2 id="fields-title" className="mb-5 text-[22px] font-bold">입력과 안내</h2><Card className="grid gap-6 md:grid-cols-2"><Input label="이메일" type="email" placeholder="이메일을 입력해 주세요" required /><Input label="비밀번호" type="password" placeholder="비밀번호를 입력해 주세요" error="필수 정보를 입력해 주세요." /><Input label="이름" placeholder="입력할 수 없는 상태" disabled /><div className="flex flex-col gap-5"><Checkbox label="서비스 이용약관 및 개인정보 처리방침에 동의합니다." checked={checked} onChange={(event) => setChecked(event.target.checked)} /><InlineAlert title="필수 정보를 입력해 주세요.">입력 내용을 확인한 뒤 다시 진행해 주세요.</InlineAlert></div></Card></section>
      <section aria-labelledby="labels-title"><h2 id="labels-title" className="mb-5 text-[22px] font-bold">배지와 진행률</h2><Card className="space-y-7"><div className="flex flex-wrap gap-3"><Badge>기본 실력 점검</Badge><Badge tone="success">잘한 유형</Badge><Badge tone="warning">오늘의 단어</Badge><Badge tone="error">다시 볼 유형</Badge></div><ProgressBar value={8} max={20} label="무료진단" showValue /></Card></section>
      <section aria-labelledby="domain-title"><h2 id="domain-title" className="mb-5 text-[22px] font-bold">학습 UI</h2><div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]"><QuestionCard number={1} total={20} category="어휘 · 문맥" question="The manager asked the team to _____ the report." instruction="빈칸에 들어갈 가장 알맞은 표현을 선택하세요." options={options} selected={selected} onSelect={setSelected} /><ResultSummary correct={16} total={20} /></div></section>
    </PageContainer>
  </>
}
