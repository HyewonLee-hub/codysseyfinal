// 오답 함정 표시 이름. 함정 ID(TR-xx)는 내부 고유코드라 화면·PDF에 노출하지 않고 항상 이 이름으로 바꿔 쓴다.
// 이름은 backend/data/taxonomy/types.json의 함정 목록을 화면용으로 짧게 줄인 것이다.
const TRAP_NAMES = {
  'TR-01': '품사 혼동',
  'TR-02': '형태 유사어',
  'TR-03': '문맥·연어 불일치',
  'TR-04': '결합 전치사 불일치',
  'TR-05': '구·절 기능 혼동',
  'TR-06': '시점 단서 무시',
  'TR-07': '능동/수동 혼동',
  'TR-08': '수 일치 혼동',
  'TR-09': '준동사 형태 혼동',
  'TR-10': '자동사/타동사 혼동',
  'TR-11': '지시 대상 불일치',
  'TR-12': '논리 관계 혼동',
  'TR-13': '가산성·한정사 불일치',
  'TR-14': '관용 표현 변형',
  'TR-15': '비교 형태 혼동',
  'TR-16': '절의 완전성 오판',
  'TR-17': '흐름과 무관한 문장',
}

const TRAP_ID_PATTERN = /TR-\d{2}/g

export function trapName(trapId) {
  return TRAP_NAMES[trapId] ?? '기타 함정'
}

// 백엔드 추천 사유 문장(예: "TR-01 함정 3회 반복") 속 함정 ID를 이름으로 바꾼다.
export function replaceTrapIds(text) {
  return text.replace(TRAP_ID_PATTERN, (trapId) => `'${trapName(trapId)}'`)
}
