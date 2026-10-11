-- 1. learning_sessions
create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),

  learner_id uuid
    references public.learners(id)
    on delete cascade,

  mode text not null,

  subtype_id text
    references public.subtypes(id)
    on delete set null,

  status text not null default 'in_progress',

  started_at timestamptz not null default now(),
  completed_at timestamptz,

  created_at timestamptz not null default now(),

  constraint learning_sessions_mode_check
    check (
      mode in (
        'weak_learning',
        'daily_general',
        'daily_vocabulary',
        'daily_grammar',
        'wrong_review'
      )
    ),

  constraint learning_sessions_status_check
    check (
      status in (
        'in_progress',
        'completed',
        'abandoned'
      )
    )
);


-- 2. question_attempts 확장
alter table public.question_attempts
  add column if not exists learning_session_id uuid
    references public.learning_sessions(id)
    on delete cascade,

  add column if not exists context text;


-- 3. context 값 제한
alter table public.question_attempts
  add constraint question_attempts_context_check
  check (
    context is null
    or context in (
      'diagnostic',
      'weak_learning',
      'daily_general',
      'daily_vocabulary',
      'daily_grammar',
      'wrong_review'
    )
  );