import Card from '../common/Card.jsx'

export default function ResultSummary({ correct, total, label = '오늘의 정답률', className = '' }) {
  const rate = total > 0 ? Math.round(correct / total * 100) : 0
  return <Card as="section" aria-label="학습 결과 요약" className={`relative overflow-hidden border-0 bg-[#e4edff] p-8 sm:p-11 ${className}`}>
    <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent-violet" aria-hidden="true" />
    <p className="relative text-[15px] font-bold text-primary">정답 수</p>
    <p className="relative mt-10 text-[clamp(4rem,12vw,7.375rem)] font-bold leading-none tracking-[-0.08em] text-primary">{correct}<span className="ml-2 text-[clamp(1.75rem,5vw,2.7rem)] text-[#7592d7]">/{total}</span></p>
    <div className="relative mt-16 flex flex-wrap items-baseline gap-3"><strong className="text-3xl text-ink">{rate}%</strong><span className="text-[15px] text-body">{label}</span></div>
  </Card>
}
