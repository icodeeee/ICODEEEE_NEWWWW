-- 003_estimate_funnel.sql
--
-- Columns for the gated estimate funnel on service pages. A visitor picks a
-- package, registers, and answers three multiple-choice questions; we store
-- which package they chose, what they answered and the range we showed them,
-- so a follow-up conversation can start from real context instead of a blank
-- form.
--
-- All columns are nullable and the insert path degrades gracefully if this
-- migration has not been applied yet — a lead is never lost because an
-- optional column is missing.

alter table public.leads
  add column if not exists package_name text,
  add column if not exists estimate_range text,
  add column if not exists answers jsonb,
  add column if not exists demo_requested boolean not null default false;

comment on column public.leads.package_name is 'Service option chosen in the estimate funnel';
comment on column public.leads.estimate_range is 'Indicative range shown to the visitor, e.g. "₹1.2L – ₹2L"';
comment on column public.leads.answers is 'Funnel answers as an object keyed by question id';
comment on column public.leads.demo_requested is 'Visitor asked for a free demo landing page built from their brief';

-- Reporting: which package gets chosen, and how often the demo is asked for.
create index if not exists leads_package_name_idx on public.leads (package_name)
  where package_name is not null;

create index if not exists leads_demo_requested_idx on public.leads (created_at desc)
  where demo_requested = true;