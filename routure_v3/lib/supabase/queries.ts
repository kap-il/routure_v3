import { createServerClient } from './client';
import type { Issue, IssuePage, Article } from './types';

// --- Issues ---

export async function getIssues(): Promise<Issue[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('issue_number', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedIssues(): Promise<Issue[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('is_featured', true)
    .order('publish_date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function getIssuePages(issueId: string): Promise<IssuePage[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('issue_pages')
    .select('*')
    .eq('issue_id', issueId)
    .order('page_number', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// --- Articles ---

export async function getArticles(): Promise<Article[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('publish_date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('publish_date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// --- Contact ---

export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('contact_submissions')
    .insert(data);

  if (error) throw error;
}
