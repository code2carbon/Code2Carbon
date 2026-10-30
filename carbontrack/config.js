/* ==========================================================================
   CarbonTrack Centralized Configuration Loader (config.js)
   --------------------------------------------------------------------------
   - Loads runtime environment variables from window.__ENV__ (or localStorage).
   - Provides safe fallback placeholders if no environment is configured.
   - Prevents hardcoding sensitive credentials in source code files.
   - Ensures zero secrets are committed to Git.
   ========================================================================== */

(function (window) {
    'use strict';

    // 1. Read from window.__ENV__ (injected via gitignored env.js or server)
    const env = window.__ENV__ || {};

    // 2. Allow optional runtime override via localStorage (useful for debugging/testing in UI)
    let localOverride = {};
    try {
        const stored = localStorage.getItem('carbontrack_env_override');
        if (stored) {
            localOverride = JSON.parse(stored);
        }
    } catch (e) {
        // Storage access might be restricted; ignore
    }

    // 3. Resolve configuration with priority: localStorage > window.__ENV__ > Fallback Placeholder
    const SUPABASE_URL = (localOverride.SUPABASE_URL || env.SUPABASE_URL || "").trim();
    const SUPABASE_ANON_KEY = (localOverride.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || "").trim();

    /**
     * Check if valid Supabase credentials have been configured
     */
    function isSupabaseConfigured() {
        return Boolean(
            SUPABASE_URL && 
            SUPABASE_ANON_KEY && 
            !SUPABASE_URL.includes("your-project") && 
            !SUPABASE_ANON_KEY.includes("your-anon")
        );
    }

    // 4. Expose immutable configuration object on window
    window.CarbonTrackConfig = Object.freeze({
        SUPABASE_URL: SUPABASE_URL,
        SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
        isConfigured: isSupabaseConfigured,
        
        /**
         * Optional helper to set temporary runtime overrides in localStorage
         */
        setRuntimeOverride: function (url, key) {
            try {
                localStorage.setItem('carbontrack_env_override', JSON.stringify({
                    SUPABASE_URL: url,
                    SUPABASE_ANON_KEY: key
                }));
                console.info('CarbonTrack environment override updated. Reload page to apply.');
            } catch (e) {
                console.error('Failed to save environment override:', e);
            }
        },
        
        /**
         * Clear runtime overrides
         */
        clearRuntimeOverride: function () {
            try {
                localStorage.removeItem('carbontrack_env_override');
                console.info('CarbonTrack environment override cleared.');
            } catch (e) {
                console.error('Failed to clear override:', e);
            }
        }
    });

})(window);
