-- =========================================================
-- 1. types 테이블에 기존 taxonomy 메타데이터 추가
-- =========================================================

alter table public.types
  add column if not exists group_code text,
  add column if not exists area_code text,
  add column if not exists weight text,
  add column if not exists rule text;


-- =========================================================
-- 2. 세부유형별 상세 규칙 저장 테이블
-- =========================================================

create table if not exists public.subtype_specs (
  subtype_id text primary key
    references public.subtypes(id)
    on delete cascade,

  answer_rule text,

  cues jsonb not null default '[]'::jsonb,

  judgment text,
  scope text,
  option_pattern text,
  difficulty_default text,

  distractors jsonb not null default '[]'::jsonb,

  vocab jsonb,

  example_item jsonb,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================================
-- 3. 문제 데이터에 필요한 메타데이터 추가
-- =========================================================

alter table public.questions
  add column if not exists translation text,
  add column if not exists source text,
  add column if not exists verified boolean not null default false;