import Card from '../common/Card.jsx'
import ChoiceOption from '../common/ChoiceOption.jsx'
import ProgressBar from '../common/ProgressBar.jsx'

export default function QuestionCard({ number, total, category, question, instruction, options, selected, onSelect, name = 'question', className = '' }) {
  return <Card as="section" className={className} aria-label={`${number}번 문제`}>
    <div className="mb-5 flex items-center justify-between gap-4 text-sm"><span className="font-bold text-primary">문제 {String(number).padStart(2, '0')} / {total}</span><span className="text-muted">{category}</span></div>
    <ProgressBar value={number} max={total} label="문제 진행률" className="mb-8" />
    <h3 className="text-xl font-bold leading-[1.4] text-ink sm:text-[28px]">{question}</h3>
    {instruction && <p className="mt-4 text-[15px] text-muted">{instruction}</p>}
    <fieldset className="mt-7 grid gap-3"><legend className="sr-only">답안 선택</legend>{options.map((option) => <ChoiceOption key={option.value} name={name} value={option.value} label={option.label} checked={selected === option.value} onChange={() => onSelect?.(option.value)} />)}</fieldset>
  </Card>
}
