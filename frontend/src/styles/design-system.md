# TOEIC 웹 디자인 시스템

기준: Figma `mdiiT4NPmkAxztqqpKnqfJ`, `전체 화면 · 1안`. 홈, 인증, 진단, 단어, 학습, 결과, 마이페이지, 고객센터의 반복 UI를 확인했다. Tailwind CSS v4 토큰은 `src/index.css`의 `@theme`에 정의한다.

## 색상

| 역할 | 토큰 | 값 | Figma 근거 |
|---|---|---|---|
| 주요 버튼·강조 | `primary` | `#3155C9` | 홈·진단·학습 헤더와 버튼. 일부 화면은 `#3157C8` |
| 보조 강조 | `success` | `#168261` | 단어·잘한 유형 |
| 따뜻한 강조 | `accent-coral` | `#D66A54` | 다시 볼 유형 |
| 주의 | `warning`, `warning-soft` | `#A46818`, `#FFF0D4` | 단어 카드의 노란 톤 |
| 오류 | `error`, `error-soft` | `#D64545`, `#FFF1F0` | 회원가입 입력 오류 |
| 장식 | `accent-violet` | `#E8E3FF` | 결과·고객센터 배경 |
| 화면·표면 | `canvas`, `surface`, `primary-soft` | `#FAFBFD`, `#FFFFFF`, `#E7F1FF` | 기본 화면·카드·인증 화면 |
| 제목·본문·보조 | `ink`, `body`, `muted` | `#202936`, `#52657C`, `#65768A` | 제목, 설명, 보조 정보 |
| 내비게이션 | `nav` | `#263344` | 상단 메뉴 |
| 테두리 | `line`, `divider`, `field` | `#E8EDF2`, `#CCD8E5`, `#C6D2E1` | 헤더, 결과 구분선, 입력 필드 |

## 서체와 크기

- 기본: Gmarket Sans Regular/Bold. Figma 일부 혼합 텍스트에 Noto Sans KR, 일부 학습 화면에 Inter가 사용된다. 프로젝트에 폰트 파일이 없어 CSS는 Gmarket Sans → Noto Sans KR → sans-serif 순서로 설정했다. 실제 폰트 파일 확보 후 시각 검증이 필요하다.
- 큰 제목: 42–66px, 줄 높이 약 1.16–1.22, 자간 약 `-0.05em`.
- 섹션 제목: 22–30px. 본문: 15–18px, 줄 높이 약 1.5–1.6. 라벨·캡션: 13–14px.
- 굵기: Regular 400, Bold 700. Figma의 Noto Sans KR Medium은 필요 화면에서 500.

## 형태와 간격

- 간격은 4px 단위를 기본으로 하고 8, 12, 16, 24, 32, 48, 72px을 주로 쓴다. 화면 가로 여백은 데스크톱에서 72px이며 작은 화면에서는 줄인다.
- 입력 모서리 10px, 안내 12px, 선택 항목 16px, 카드 24–32px, 버튼은 pill 형태.
- 헤더 그림자 `0 6px 15px rgb(146 175 202 / 11%)`. 카드 그림자는 옅은 파란 계열을 사용한다.

## 상태

| 요소 | Figma에서 확인 | 구현 보완 |
|---|---|---|
| 버튼 기본 | 파란 배경, 흰 글자, pill | — |
| 버튼 hover | 명시된 상태 없음 | `#2545AD`로 밝기 변경 |
| 버튼 disabled | 명시된 상태 없음 | 회색 배경과 보조 글자색 |
| 입력 기본 | 흰 표면, 연한 테두리 | — |
| 입력 focus | 명시된 상태 없음 | 파란 테두리와 옅은 focus ring |
| 입력 error | 빨간 안내·연한 오류 배경 | `aria-invalid`와 메시지 연결 |
| 입력 disabled | 명시된 상태 없음 | 흐린 배경과 보조 글자색 |

## 구현 컴포넌트

- `common`: Button, Input, Checkbox, ChoiceOption, ProgressBar, Badge, Card, SectionTitle, InlineAlert.
- `layout`: Header, PageContainer.
- `domain`: QuestionCard, ResultSummary.
- `pages/ComponentsPreview.jsx`: 공통 요소의 mock data와 상태 확인용 화면. 실제 서비스 페이지나 API 연결은 포함하지 않는다.

Figma에 독립된 공통 패턴으로 확인되지 않은 Select, Modal, Toast, EmptyState 등은 이번 범위에서 제외했다.
