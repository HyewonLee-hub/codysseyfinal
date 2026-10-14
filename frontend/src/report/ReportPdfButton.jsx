// 'PDF 다운로드' 버튼. 클릭하면 buildDoc()(비동기 가능)으로 보고서 데이터를 만들고, 화면 밖에 A4 문서를 그린 뒤 PDF로 저장한다.
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import Button from '../components/common/Button.jsx'
import ReportDocument from './ReportDocument.jsx'
import { exportPagesToPdf } from './exportPdf.js'

export default function ReportPdfButton({ buildDoc, className = '' }) {
  const [doc, setDoc] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setError('')
    setIsBusy(true)
    try {
      await document.fonts?.ready
      setDoc(await buildDoc())
    } catch {
      setError('보고서 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
      setIsBusy(false)
    }
  }

  const handleReady = useCallback(async (pages) => {
    try {
      await exportPagesToPdf(pages, doc.filename)
    } catch {
      setError('PDF를 만들지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setDoc(null)
      setIsBusy(false)
    }
  }, [doc])

  return <>
    <Button variant="secondary" onClick={handleClick} disabled={isBusy} className={className}>{isBusy ? 'PDF 만드는 중…' : 'PDF 다운로드'}</Button>
    {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
    {doc && createPortal(<ReportDocument doc={doc} onReady={handleReady} />, document.body)}
  </>
}
