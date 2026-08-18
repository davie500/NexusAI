create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  category text not null,
  difficulty text not null default 'Medio',
  tips jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.interview_questions enable row level security;

create index if not exists idx_interview_questions_target_user
on public.interview_questions (target_user_id, created_at desc);

drop policy if exists "Admins can manage interview questions" on public.interview_questions;
create policy "Admins can manage interview questions"
on public.interview_questions
for all
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists "Users can view own interview questions" on public.interview_questions;
create policy "Users can view own interview questions"
on public.interview_questions
for select
to authenticated
using (target_user_id = auth.uid());

drop trigger if exists update_interview_questions_updated_at on public.interview_questions;
create trigger update_interview_questions_updated_at
before update on public.interview_questions
for each row
execute function public.update_updated_at_column();
