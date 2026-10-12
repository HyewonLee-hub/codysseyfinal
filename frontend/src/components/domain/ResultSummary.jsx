import Card from '../common/Card.jsx'

export default function ResultSummary({ correct, total, label = '오늘의 정답률', variant = 'default', result, className = '' }) {
  if (variant === 'study') return <Card as="section" aria-label="학습 결과 요약" className={`relative min-h-[500px] overflow-hidden !rounded-[28px] !border-0 !bg-[#e4edff] !p-0 lg:h-[526px] ${className}`}>
    <span aria-hidden="true" className="pointer-events-none absolute -top-[165px] -right-[170px] aspect-square w-[370px] shrink-0 rounded-full bg-[#dcd8ff]" />
    <span aria-hidden="true" className="pointer-events-none absolute -bottom-[185px] -left-[170px] aspect-square w-[300px] shrink-0 rounded-full bg-[#fff2d6]" />
    <p className="sr-only">{result.total}문제 중 {result.correct}문제 정답, {result.incorrect}문제 오답, 정답률 {result.accuracy}%</p>
    <p className="relative ml-[45px] mt-[42px] text-[15px] font-bold text-[#305bc0]">정답 수</p>
    <p aria-hidden="true" className="relative ml-[45px] mt-[71px] whitespace-nowrap text-[clamp(72px,10vw,118px)] leading-none font-bold tracking-[-0.08em] text-primary">{result.correct}<span className="ml-1 text-[clamp(32px,4vw,43px)] tracking-[-0.04em] text-[#7592d7]">/{result.total}</span></p>
    <div aria-hidden="true" className="absolute bottom-[45px] left-[49px] flex flex-wrap items-baseline gap-4"><strong className="text-[30px] text-ink">{result.accuracy}%</strong><span className="text-[15px] text-body">오늘의 정답률</span></div>
  </Card>

  if (variant === 'diagnosis') return <Card as="section" aria-label="진단 결과 요약" className={`relative min-h-[500px] overflow-hidden !rounded-[38px] !border-0 !bg-[#dfeaff] !p-8 sm:!p-12 lg:h-[600px] ${className}`}>
    <div className="absolute -left-[180px] top-[415px] size-[400px] rounded-full bg-accent-violet" aria-hidden="true" />
    <div className="relative">
      <p className="text-sm font-bold text-primary">진단 결과 · 예상 점수</p>
      <strong className="mt-[77px] block text-[clamp(76px,12vw,122px)] leading-none tracking-[-0.06em] text-primary">{result.expectedScore}</strong>
      <p className="mt-[21px] text-[18px] leading-normal text-[#526783]">추천 학습<br />{result.recommendedStudy}</p>
    </div>
  </Card>

  const rate = total > 0 ? Math.round(correct / total * 100) : 0
  return <Card as="section" aria-label="학습 결과 요약" className={`relative overflow-hidden border-0 bg-[#e4edff] p-8 sm:p-11 ${className}`}>
    <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent-violet" aria-hidden="true" />
    <p className="relative text-[15px] font-bold text-primary">정답 수</p>
    <p className="relative mt-10 text-[clamp(4rem,12vw,7.375rem)] font-bold leading-none tracking-[-0.08em] text-primary">{correct}<span className="ml-2 text-[clamp(1.75rem,5vw,2.7rem)] text-[#7592d7]">/{total}</span></p>
    <div className="relative mt-16 flex flex-wrap items-baseline gap-3"><strong className="text-3xl text-ink">{rate}%</strong><span className="text-[15px] text-body">{label}</span></div>
  </Card>
}
