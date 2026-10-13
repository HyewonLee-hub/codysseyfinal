

export default function WordRow({ word, selected, saved, memorized, isUpdating = false, onSelect, onSave, onMemorizedChange }) {
  return <li className={`relative grid min-h-[166px] min-w-0 grid-cols-[minmax(0,1fr)_44px] items-center gap-x-3 border-b border-[#d6e0ea] pb-10 pt-5 transition-colors ${selected ? 'bg-[#f2f6ff]' : 'bg-white'}`}>
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${word.word}, ${word.meaning}. 예문: ${word.example}`}
      onClick={() => onSelect(word.id)}
      className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 text-left focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[48px_minmax(120px,1fr)_minmax(110px,0.85fr)] md:grid-cols-[48px_minmax(115px,1fr)_minmax(100px,0.8fr)_minmax(140px,1.2fr)] lg:grid-cols-[52px_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.15fr)] xl:grid-cols-[70px_260px_200px_minmax(0,1fr)]"
    >
      <span className="text-[14px] font-bold text-primary">{String(word.number).padStart(2, '0')}</span>
      <span className="min-w-0 break-words text-[24px] leading-tight font-bold tracking-[-0.035em] text-ink sm:text-[28px]">{word.word}</span>
      <span className="col-start-2 min-w-0 break-words text-[16px] text-ink sm:col-start-3 sm:text-[17px]">{word.meaning}</span>
      <span className="col-start-2 min-w-0 break-words text-[15px] leading-6 text-body sm:col-start-2 sm:col-span-2 md:col-start-4 md:col-span-1 md:text-[16px]">{word.example}</span>
    </button>
    <button
      type="button"
      aria-label={`${word.word} ${saved ? '저장 해제' : '저장'}`}
      aria-pressed={saved}
      onClick={() => onSave(word.id)}
      disabled={isUpdating}
      className={`flex size-[42px] shrink-0 items-center justify-center rounded-full border text-[23px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${saved ? 'border-primary bg-primary text-white' : 'border-[#c9d9ed] bg-white text-primary hover:bg-primary-soft'}`}
    >
      <span aria-hidden="true">{saved ? '✓' : '+'}</span>
    </button>
    <label
  htmlFor={`memorized-${word.id}`}
  className="absolute right-11 bottom-3 flex h-[30px] w-[134px] cursor-pointer items-center justify-center gap-[5px] rounded-full border border-[#9aa7ba] bg-white px-2"
>
  <input
    id={`memorized-${word.id}`}
    type="checkbox"
    checked={memorized}
    onChange={() => onMemorizedChange(word.id)}
    disabled={isUpdating}
    aria-label={`${word.word} 외웠어요`}
    className="m-0 h-[13px] w-[13px] shrink-0 cursor-pointer accent-[#3157cc]"
  />
  <span className="text-[14px] leading-none font-medium text-[#45616d]">
    외웠어요
  </span>
</label>
  </li>
}
