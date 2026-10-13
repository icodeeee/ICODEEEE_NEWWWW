-- 002_campaign_attribution.sql
--
-- Adds campaign attribution columns to public.leads so enquiries can be traced
-- back to the advertising that produced them. All columns are nullable and the
-- insert path degrades gracefully if this migration has not been applied yet.

alter table public.leads
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists fbclid text,
  add column if not exists gclid text;

comment on column public.leads.utm_source is 'Marketing source that first brought the visitor, e.g. facebook';
comment on column public.leads.utm_campaign is 'Campaign name from the landing URL';