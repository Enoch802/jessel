// ============================================
// JESSEL — Shared Supabase connection
// Paste your real values below (from Supabase -> Project Settings -> API)
// This file is loaded by every page via <script src="supabase-config.js">
// ============================================

const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLISHABLE_KEY_HERE";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
