import Card from '../common/Card.jsx'
import ChoiceOption from '../common/ChoiceOption.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

export default function QuestionCard({ number, total, category, question, instruction, options, selected, onSelect, name = 'question', variant = 'default', error, className = '' }) {
  if (variant === 'diagnosis') return <section aria-label={`${number}번 문제`} className={className}>
    <p className="text-[15px] leading-[18px] font-bold text-primary">{category}</p>
    <h2 className="mt-[42px] text-[clamp(24px,3vw,32px)] leading-[1.35] font-bold tracking-[-0.03em] text-ink">{question}</h2>
    <fieldset aria-invalid={Boolean(error)} aria-describedby={error ? 'diagnosis-answer-error' : undefined} className="mt-[47px] grid gap-x-[44px] gap-y-[27px] sm:grid-cols-2">
      <legend className="sr-only">답안 선택</legend>
      {options.map((option) => <ChoiceOption key={option.value} variant="diagnosis" name={name} value={option.value} label={option.label} checked={selected === option.value} onChange={() => onSelect?.(option.value)} />)}
    </fieldset>
    {error && <p id="diagnosis-answer-error" role="alert" className="mt-4 text-sm text-error">{error}</p>}
  </section>

  return <Card as="section" className={className} aria-label={`${number}번 문제`}>
    <div className="mb-5 flex items-center justify-between gap-4 text-sm"><span className="font-bold text-primary">문제 {String(number).padStart(2, '0')} / {total}</span><span className="text-muted">{category}</span></div>
    <ProgressBar value={number} max={total} label="문제 진행률" className="mb-8" />
    <h3 className="text-xl font-bold leading-[1.4] text-ink sm:text-[28px]">{question}</h3>
    {instruction && <p className="mt-4 text-[15px] text-muted">{instruction}</p>}
    <fieldset className="mt-7 grid gap-3"><legend className="sr-only">답안 선택</legend>{options.map((option) => <ChoiceOption key={option.value} name={name} value={option.value} label={option.label} checked={selected === option.value} onChange={() => onSelect?.(option.value)} />)}</fieldset>
  </Card>
}
