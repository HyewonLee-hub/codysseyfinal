// A4 쪽 요소들을 이미지로 찍어 한 PDF로 저장한다. 한글 폰트를 따로 임베딩하지 않도록 html2canvas로 래스터화하고,
// 라이브러리는 버튼을 눌렀을 때만 불러온다.
export async function exportPagesToPdf(pages, filename) {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import('jspdf'), import('html2canvas')])
  await document.fonts?.ready
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
  for (const [index, page] of pages.entries()) {
    const canvas = await html2canvas(page, { scale: 2, backgroundColor: '#ffffff', logging: false })
    if (index > 0) pdf.addPage()
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297)
  }
  pdf.save(filename)
}
