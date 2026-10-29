/**
 * CarbonTrack - Client Configuration
 *
 * This file centralizes all client-side configuration values.
 *
 * IMPORTANT — Supabase Anon Key:
 * The Supabase ANON key is a *publishable* key intentionally designed to be
 * used in browser clients. It does NOT grant admin or service-role access.
 * Row-Level Security (RLS) on your Supabase tables is your real security layer.
 *
 * However, since this key has been committed to Git, it is recommended to
 * rotate/regenerate it in the Supabase Dashboard → Project Settings → API.
 *
 * For a production environment consider loading these from a server-side
 * proxy rather than embedding them in static files.
 */

window.CARBONTRACK_CONFIG = {
    SUPABASE_URL: "https://ifwnhzjfwluqjhsfykbw.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable_dDgGIa04mh20YFU1PbGSsw_M0l6mfjG"
};
