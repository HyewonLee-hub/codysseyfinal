// A4 보고서 문서(PDF 전용). 매 쪽 같은 머리글(상단 바 · TYPEUP 로고 · 보고서명)과 바닥글(저작권 · 쪽 번호 · 고지)을
// 반복하고, 블록 높이를 재서 쪽을 나눠 카드가 쪽 경계에서 잘리지 않게 한다. 데이터 형식은 reportDocs.js의 doc.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import wordmark from '../assets/brand/01_chevron_wordmark.svg'
import './report.css'

const BRAND_LINE = 'TYPEUP · 막힌 유형부터, 정확하게.'
const FOOTER_COPYRIGHT = '© TYPEUP · ALL RIGHTS RESERVED'
const FOOTER_NOTICE = '본 보고서는 TYPEUP 학습 기록으로 자동 생성되었습니다. 예상 점수는 참고용이며 정식 TOEIC 성적이 아닙니다.'
const BODY_HEIGHT = 900 // A4(794×1123px)에서 머리글·바닥글을 뺀 본문 높이

function SectionTitle({ number, title, description }) {
  return <div className="rp-sec">
    <svg className="rp-num" width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="30" rx="8" fill="#3155c9" /><text x="15" y="19.5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="sans-serif">{String(number).padStart(2, "0")}</text></svg>
    <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
  </div>
}

function Bar({ label, value, pct, tone }) {
  return <div className="rp-bar">
    <div className="rp-bar-l"><b>{label}</b><span>{value}</span></div>
    <div className="rp-track"><div className={`rp-fill rp-${tone}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>
  </div>
}

function sectionItems(section) {
  if (section.kind === 'performance') {
    if (!section.rows.length) return section.empty ? [<div className="rp-empty">{section.empty}</div>] : []
    return section.rows.map((row) => <div className={`rp-row rp-row-${section.tone}`}><Bar label={row.title} value={row.value} pct={row.pct} tone={section.tone} /></div>)
  }
  if (section.kind === 'traps') {
    if (!section.rows.length) return []
    const max = Math.max(1, ...section.rows.map((row) => row.count))
    return [<div className="rp-card">{section.rows.map((row) => <Bar key={row.label} label={row.label} value={`${row.count}회`} pct={row.count / max * 100} tone="trap" />)}</div>]
  }
  if (section.kind === 'recommend') {
    return section.rows.map((row) => <div className="rp-rec">
      <b>{row.title}</b>
      {row.detail && <p className="rp-mut">{row.detail}</p>}
      {row.reasons.map((reason) => <p key={reason}><em>이유</em>{reason}</p>)}
      {row.traps.length > 0 && <p><em>주의</em>{row.traps.join(', ')}</p>}
    </div>)
  }
  if (section.kind === 'steps') {
    return section.rows.length ? [<ol className="rp-steps">{section.rows.map((step, index) => <li key={step}><b>{index + 1}.</b><span>{step}</span></li>)}</ol>] : []
  }
  return []
}

// 쪽 나눔 단위 블록. 섹션 제목은 첫 항목과 한 블록으로 묶어 제목만 쪽 끝에 남지 않게 한다.
function buildBlocks(doc) {
  const kpis = doc.kpis.filter((kpi) => kpi.value)
  const blocks = [<div className="rp-cover">
    <p className="rp-kind">{doc.subtitle}</p>
    <h1>{doc.title}</h1>
    <table className="rp-meta"><tbody>
      {doc.meta.filter((item) => item.value).map((item) => <tr key={item.label}><th>{item.label}</th><td>{item.value}</td></tr>)}
    </tbody></table>
    <div className="rp-kpis">{kpis.map((kpi) => <div key={kpi.label} className="rp-kpi"><strong>{kpi.value}</strong><span>{kpi.label}</span></div>)}</div>
  </div>]

  let number = 0
  for (const section of doc.sections) {
    const items = sectionItems(section)
    if (!items.length) continue
    number += 1
    const title = <SectionTitle number={number} title={section.title} description={section.description} />
    items.forEach((item, index) => blocks.push(index === 0 ? <>{title}{item}</> : item))
  }
  return blocks
}

function paginate(container) {
  const pages = [[]]
  let used = 0
  Array.from(container.children).forEach((element, index) => {
    const height = element.offsetHeight
    if (used + height > BODY_HEIGHT && pages[pages.length - 1].length) {
      pages.push([])
      used = 0
    }
    pages[pages.length - 1].push(index)
    used += height
  })
  return pages
}

function Page({ doc, number, total, children }) {
  return <div className="rp-page">
    <div className="rp-topbar" />
    <header className="rp-head">
      <div><p className="rp-b1">{BRAND_LINE}</p><p className="rp-b2">{doc.subtitle} · {doc.title}</p></div>
      <img src={wordmark} alt="TYPEUP" />
    </header>
    <main className="rp-body">{children}</main>
    <footer className="rp-foot">
      <div className="rp-foot-r"><b>{FOOTER_COPYRIGHT}</b><span>{doc.title} · {number}/{total}</span></div>
      <p>{FOOTER_NOTICE}</p>
    </footer>
  </div>
}

// onReady(쪽 요소 배열)는 쪽 나눔이 끝나 그려진 뒤 한 번 호출된다.
export default function ReportDocument({ doc, onReady }) {
  const blocks = useMemo(() => buildBlocks(doc), [doc])
  const [pages, setPages] = useState(null)
  const rootRef = useRef(null)
  const measureRef = useCallback((node) => { if (node) setPages(paginate(node)) }, [])

  useEffect(() => {
    if (pages) onReady(Array.from(rootRef.current.querySelectorAll('.rp-page')))
  }, [pages, onReady])

  return <div className="rp-root" ref={rootRef} aria-hidden="true">
    {!pages && <div className="rp-measure" ref={measureRef}>{blocks.map((block, index) => <div key={index} className="rp-blk">{block}</div>)}</div>}
    {pages?.map((indexes, pageIndex) => <Page key={pageIndex} doc={doc} number={pageIndex + 1} total={pages.length}>
      {indexes.map((index) => <div key={index} className="rp-blk">{blocks[index]}</div>)}
    </Page>)}
  </div>
}
