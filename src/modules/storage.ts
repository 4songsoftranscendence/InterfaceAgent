// ============================================
// DESIGN SCOUT — Storage (Supabase + Local JSON fallback)
// ============================================
// Stores analyses and briefs. Uses Supabase if configured,
// otherwise falls back to local JSON files.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as fs from "fs/promises";
import * as path from "path";
import { randomUUID } from "crypto";
import type {
  UIAnalysis,
  DesignBrief,
  LibraryEntry,
} from "../types/index.js";

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    supabase = createClient(url, key);
    return supabase;
  }
  return null;
}

// ============================================
// Save analysis to library
// ============================================
export async function saveAnalysis(
  analysis: UIAnalysis,
  category: string,
  tags: string[] = []
): Promise<string> {
  const entry: LibraryEntry = {
    id: randomUUID(),
    category,
    url: analysis.url,
    analysis,
    tags,
    createdAt: new Date().toISOString(),
  };

  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("design_library").insert({
      id: entry.id,
      category: entry.category,
      url: entry.url,
      analysis: entry.analysis,
      tags: entry.tags,
      created_at: entry.createdAt,
    });
    if (error) {
      console.warn(`   ⚠️  Supabase save failed, falling back to local: ${error.message}`);
      return saveLocal("analyses", entry);
    }
    console.log(`   💾 Saved to Supabase: ${entry.id}`);
    return entry.id;
  }

  return saveLocal("analyses", entry);
}

// ============================================
// Save design brief
// ============================================
export async function saveBrief(brief: DesignBrief): Promise<string> {
  const sb = getSupabase();
  if (sb) {
    const { error } = await sb.from("design_briefs").insert({
      id: brief.id,
      category: brief.category,
      goal: brief.goal,
      brief: brief,
      created_at: brief.createdAt,
    });
    if (error) {
      console.warn(`   ⚠️  Supabase save failed, falling back to local: ${error.message}`);
      return saveLocal("briefs", brief);
    }
    console.log(`   💾 Brief saved to Supabase: ${brief.id}`);
    return brief.id;
  }

  return saveLocal("briefs", brief);
}

// ============================================
// Query library by category
// ============================================
export async function getByCategory(
  category: string
): Promise<LibraryEntry[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("design_library")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });
    if (!error && data) return data as LibraryEntry[];
  }

  // Fallback to local
  return loadLocal<LibraryEntry>("analyses", (e) => e.category === category);
}

// ============================================
// Get all briefs
// ============================================
export async function getBriefs(
  category?: string
): Promise<DesignBrief[]> {
  const sb = getSupabase();
  if (sb) {
    let query = sb
      .from("design_briefs")
      .select("brief")
      .order("created_at", { ascending: false });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (!error && data) return data.map((d: any) => d.brief);
  }

  return loadLocal<DesignBrief>("briefs", (b) =>
    category ? b.category === category : true
  );
}

// ============================================
// Local JSON storage helpers
// ============================================
const LOCAL_DIR = "./output/library";

async function saveLocal(collection: string, data: any): Promise<string> {
  const dir = path.join(LOCAL_DIR, collection);
  await fs.mkdir(dir, { recursive: true });

  const id = data.id || randomUUID();
  const filepath = path.join(dir, `${id}.json`);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2));
  console.log(`   💾 Saved locally: ${filepath}`);
  return id;
}

async function loadLocal<T>(
  collection: string,
  filter?: (item: T) => boolean
): Promise<T[]> {
  const dir = path.join(LOCAL_DIR, collection);
  try {
    const files = await fs.readdir(dir);
    const items: T[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const content = await fs.readFile(path.join(dir, file), "utf-8");
      const item = JSON.parse(content) as T;
      if (!filter || filter(item)) items.push(item);
    }
    return items;
  } catch {
    return [];
  }
}

// ============================================
// Supabase table setup SQL (for reference)
// ============================================
export const SETUP_SQL = `
-- Run this in your Supabase SQL editor to create the tables

create table if not exists design_library (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  url text not null,
  analysis jsonb not null,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_library_category on design_library(category);

create table if not exists design_briefs (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  goal text,
  brief jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_briefs_category on design_briefs(category);

-- RLS policies (enable if using anon key)
alter table design_library enable row level security;
alter table design_briefs enable row level security;

create policy "Allow all for now" on design_library for all using (true);
create policy "Allow all for now" on design_briefs for all using (true);
`;
