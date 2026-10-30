/**
 * ==========================================================================
 * CarbonTrack Environment Variables Template (env.example.js)
 * ==========================================================================
 * 
 * INSTRUCTIONS:
 * 1. Copy this file and name it 'env.js' in the same 'carbontrack/' directory.
 * 2. Replace the placeholder values below with your real Supabase credentials.
 * 3. The 'env.js' file is ignored by .gitignore and will NEVER be pushed to GitHub.
 * 
 * In production (e.g. Netlify, Vercel, or custom servers), you can also inject
 * window.__ENV__ directly into index.html or set them via build scripts.
 */
window.__ENV__ = {
    // Your Supabase project URL (e.g., https://xyzcompany.supabase.co)
    SUPABASE_URL: "https://your-project-id.supabase.co",

    // Your Supabase public 'anon' publishable key
    SUPABASE_ANON_KEY: "your-anon-publishable-key-here"
};
