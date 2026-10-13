import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { projectFallback } from "@/lib/site";
import type { Project } from "@/lib/types";

/**
 * Public project reads use a plain anon client rather than the request-bound
 * server client.
 *
 * Published projects are readable by anon under the "public reads published
 * projects" RLS policy, so no visitor session is required. Avoiding cookies()
 * here keeps these routes statically renderable: previously the dynamic API
 * forced `/work` and `/work/[slug]` to render per request, which also meant
 * unknown slugs streamed a not-found page with HTTP 200 instead of 404.
 */
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

export async function getProjects(): Promise<Project[]> {
  const supabase = publicClient();
  if (!supabase) return projectFallback;
  const { data, error } = await supabase.from("projects").select("*").eq("published", true).order("order");
  return error || !data?.length ? projectFallback : (data as Project[]);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}