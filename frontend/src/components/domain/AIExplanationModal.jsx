import { useEffect, useState } from 'react'
import Button from '../common/Button.jsx'
import { getAIExplanation } from '../../api/ai.js'

function getErrorMessage(error) {
  if (error.response?.status === 404) return '해당 학습 기록을 찾을 수 없습니다.'
  if (error.response?.status === 502) return 'AI 해설을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
  if (error.response?.status === 401) return '로그인 후 AI 해설을 확인할 수 있습니다.'
  return 'AI 해설을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
}

const sections = [
  ['정답 이유', 'correct_reason'],
  ['선택한 답 분석', 'selected_choice_reason'],
  ['핵심 규칙', 'rule'],
  ['다음 팁', 'next_tip'],
]

export default function AIExplanationModal({ attemptId, onClose }) {
  const [explanation, setExplanation] = useState(null)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let isActive = true
    getAIExplanation(attemptId)
      .then((response) => { if (isActive) setExplanation(response.explanation ?? {}) })
      .catch((requestError) => { if (isActive) setError(getErrorMessage(requestError)) })
    return () => { isActive = false }
  }, [attemptId, requestVersion])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div role="presentation" className="fixed inset-0 z-50 flex items-end bg-[#20232a]/45 p-4 sm:items-center sm:justify-center" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="ai-explanation-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-canvas p-6 shadow-xl sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-sm font-bold text-primary">AI 해설</p><h2 id="ai-explanation-title" className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-ink">틀린 이유를 확인하세요.</h2></div>
        <button type="button" onClick={onClose} aria-label="AI 해설 닫기" className="rounded p-2 text-xl leading-none text-body focus-visible:outline-2 focus-visible:outline-primary">×</button>
      </div>
      {!explanation && !error && <p role="status" className="mt-8 text-base text-body">AI 해설 생성 중...</p>}
      {error && <div className="mt-8"><p role="alert" className="text-base leading-7 text-error">{error}</p><Button variant="secondary" onClick={() => { setError(''); setExplanation(null); setRequestVersion((version) => version + 1) }} className="mt-4">다시 시도하기</Button></div>}
      {explanation && <div className="mt-7 space-y-6"><p className="rounded-[18px] bg-[#e9f0ff] p-5 text-[16px] leading-7 text-ink">{explanation.summary ?? '해설 정보를 불러오지 못했습니다.'}</p>{sections.map(([title, key]) => <section key={key}><h3 className="text-[16px] font-bold text-ink">{title}</h3><p className="mt-2 text-[15px] leading-7 text-body">{explanation[key] ?? '설명 정보가 없습니다.'}</p></section>)}{explanation.trap && <section><h3 className="text-[16px] font-bold text-ink">자주 빠지는 함정 · {explanation.trap.name ?? '확인 필요'}</h3><p className="mt-2 text-[15px] leading-7 text-body">{explanation.trap.explanation ?? '함정 정보를 불러오지 못했습니다.'}</p></section>}</div>}
      <Button variant="secondary" onClick={onClose} className="mt-9 w-full sm:w-auto">닫기</Button>
    </section>
  </div>
}
