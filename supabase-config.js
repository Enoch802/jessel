// ============================================
// JESSEL — Shared Supabase connection
// Paste your real values below (from Supabase -> Project Settings -> API)
// This file is loaded by every page via <script src="supabase-config.js">
// ============================================

const SUPABASE_URL = "https://lubvapzunrcwqcorgprd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qXLa9TIC_u5z6EIZVQcJNA_a877E7Hs";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
