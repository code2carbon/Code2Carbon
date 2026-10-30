/* ==========================================================================
   CarbonTrack Unified Authentication & User Session Manager
   Supports Supabase Google OAuth, Email/Password, Persistent Sessions,
   and User-Specific Emission Assessment Data Storage.
   ========================================================================== */

(function () {
    'use strict';

    // Retrieve credentials from CarbonTrackConfig or window.__ENV__
    const cfg = window.CarbonTrackConfig || {};
    const env = window.__ENV__ || {};
    const SUPABASE_URL = (cfg.SUPABASE_URL || env.SUPABASE_URL || "").trim();
    const SUPABASE_ANON_KEY = (cfg.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || "").trim();
    const isSupabaseConfigured = Boolean(
        SUPABASE_URL && 
        SUPABASE_ANON_KEY && 
        !SUPABASE_URL.includes("your-project") && 
        !SUPABASE_ANON_KEY.includes("your-anon")
    );

    // Initialize Supabase Client dynamically
    let supabaseClient = null;
    if (isSupabaseConfigured && typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    storage: window.localStorage
                }
            });
            window.supabaseClient = supabaseClient;
        } catch (err) {
            console.warn('Supabase client initialization deferred:', err);
        }
    }

    const DEMO_STORAGE_KEY = 'carbontrack_active_session_demo';
    const SUBMISSIONS_STORAGE_PREFIX = 'carbontrack_user_submissions_';

    const CarbonAuth = {
        supabase: supabaseClient,
        currentUser: null,
        currentSession: null,
        isDemo: false,

        /**
         * Initialize Auth State & Listeners
         */
        async init() {
            // Check Supabase session first
            if (this.supabase) {
                try {
                    const { data, error } = await this.supabase.auth.getSession();
                    if (!error && data && data.session && data.session.user) {
                        this.currentUser = data.session.user;
                        this.currentSession = data.session;
                        this.isDemo = false;
                    }
                } catch (e) {
                    console.warn('Error reading Supabase session:', e);
                }

                // Subscribe to real-time auth changes
                try {
                    this.supabase.auth.onAuthStateChange(async (event, session) => {
                        console.log('Supabase Auth State Change:', event, session?.user?.email);
                        if (session && session.user) {
                            CarbonAuth.currentUser = session.user;
                            CarbonAuth.currentSession = session;
                            CarbonAuth.isDemo = false;
                            localStorage.removeItem(DEMO_STORAGE_KEY);
                        } else if (!CarbonAuth.isDemo) {
                            CarbonAuth.currentUser = null;
                            CarbonAuth.currentSession = null;
                        }
                        CarbonAuth.updateUI();
                        window.dispatchEvent(new CustomEvent('carbontrack:auth-changed', {
                            detail: { user: CarbonAuth.currentUser, event }
                        }));
                    });
                } catch (e) {
                    console.warn('Could not attach onAuthStateChange listener:', e);
                }
            }

            // If no Supabase session, check persistent demo session
            if (!this.currentUser) {
                try {
                    const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
                    if (savedDemo) {
                        const parsed = JSON.parse(savedDemo);
                        if (parsed && parsed.email) {
                            this.currentUser = parsed;
                            this.isDemo = true;
                        }
                    }
                } catch (e) {
                    console.warn('Error reading demo session:', e);
                }
            }

            // Sync UI across all pages
            this.updateUI();

            // Bind global UI listeners
            this.bindEvents();

            window.dispatchEvent(new CustomEvent('carbontrack:auth-ready', {
                detail: { user: this.currentUser }
            }));
        },

        /**
         * Get Current Authenticated User
         */
        getUser() {
            return this.currentUser;
        },

        /**
         * Check if User is Logged In
         */
        isAuthenticated() {
            return !!this.currentUser;
        },

        /**
         * Unique Identifier for User Storage Key
         */
        getUserStorageKey() {
            if (!this.currentUser) return 'anonymous';
            return this.currentUser.id || this.currentUser.email || 'user';
        },

        /**
         * Sign In with Google OAuth
         */
        async signInWithGoogle() {
            if (!this.supabase) {
                this.showNotice('Supabase SDK not loaded. Please check your internet connection.', 'error');
                return { error: new Error('Supabase client unavailable') };
            }

            try {
                // Determine redirect target: check URL parameter or default to calculator.html
                const params = new URLSearchParams(window.location.search);
                const redirectParam = params.get('redirect') || 'calculator.html';
                const currentFolder = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                const redirectTo = window.location.origin + currentFolder + redirectParam;

                const { data, error } = await this.supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: redirectTo,
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent'
                        }
                    }
                });

                if (error) {
                    console.warn('Google OAuth returned error:', error.message);
                    this.handleGoogleOAuthSetupPrompt(error.message);
                    return { error };
                }

                return { data };
            } catch (err) {
                console.error('Exception during Google Sign-in:', err);
                this.handleGoogleOAuthSetupPrompt(err.message || 'Unable to connect to Google provider');
                return { error: err };
            }
        },

        /**
         * Helpful handler when Supabase Google Provider requires credentials in Dashboard
         */
        handleGoogleOAuthSetupPrompt(errMsg) {
            const isProviderDisabled = /provider is not enabled|unsupported provider/i.test(errMsg);

            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';
            overlay.id = 'google-oauth-guidance-modal';
            overlay.style.zIndex = '99999';

            overlay.innerHTML = `
                <div class="modal-card glass-card" style="max-width: 520px; text-align: left; padding: 28px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 44px; height: 44px; border-radius: 12px; background: #eff6ff; display: flex; align-items: center; justify-content: center;">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                            </svg>
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.2rem; color: var(--dark);">Google Authentication Integration</h3>
                            <span style="font-size: 0.8rem; color: #2563eb; font-weight: 600;">Supabase OAuth Provider Notice</span>
                        </div>
                    </div>

                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 16px; font-size: 0.88rem; line-height: 1.5; color: #475569;">
                        ${isProviderDisabled ? `
                            <strong>Google Provider requires Dashboard activation:</strong>
                            <p style="margin: 6px 0 0 0;">In your Supabase project (<code>gqwupemhxhbfxfcraggw</code>), Google OAuth is currently switched off in <em>Authentication &rarr; Providers &rarr; Google</em>. Once enabled with your Google Cloud Client ID & Secret, this button redirects automatically to your official Google consent page.</p>
                        ` : `
                            <p style="margin: 0;"><strong>Notice:</strong> ${errMsg}</p>
                        `}
                    </div>

                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px;">
                        To test your user sessions, session persistence, and logged-in data storage immediately, you can either continue with an <strong>Instant Google Demo Session</strong> or sign in/up with <strong>Email &amp; Password</strong> below.
                    </p>

                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button type="button" class="btn btn-primary btn-block" id="btn-modal-demo-google" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <span>Continue with Google Session (Demo Mode)</span>
                        </button>
                        <button type="button" class="btn btn-secondary btn-block" id="btn-modal-use-email" style="background: #f1f5f9; border-color: #cbd5e1; color: var(--dark);">
                            <span>Use Email &amp; Password Sign In / Sign Up</span>
                        </button>
                        <button type="button" class="btn btn-block" id="btn-modal-cancel-oauth" style="background: transparent; border: none; color: #94a3b8; font-size: 0.85rem; padding: 6px;">
                            Dismiss
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            // Handler for Google Demo Login
            const btnDemo = overlay.querySelector('#btn-modal-demo-google');
            btnDemo.addEventListener('click', () => {
                overlay.remove();
                this.loginDemoUser({
                    id: 'google_user_' + Math.floor(100000 + Math.random() * 900000),
                    email: 'sustainability.officer@institution.edu',
                    user_metadata: {
                        full_name: 'Campus Sustainability Officer',
                        provider: 'google',
                        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    }
                });
            });

            // Handler for Email/Password switch
            const btnEmail = overlay.querySelector('#btn-modal-use-email');
            btnEmail.addEventListener('click', () => {
                overlay.remove();
                const emailInput = document.getElementById('login-email');
                if (emailInput) {
                    emailInput.focus();
                    emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });

            // Handler for Cancel
            const btnCancel = overlay.querySelector('#btn-modal-cancel-oauth');
            btnCancel.addEventListener('click', () => {
                overlay.remove();
            });
        },

        /**
         * Sets an active session for demo testing
         */
        loginDemoUser(userObj) {
            this.currentUser = userObj;
            this.isDemo = true;
            localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(userObj));
            this.updateUI();
            this.showNotice(`Signed in as ${userObj.email} (Google Session Active)`, 'success');
            window.dispatchEvent(new CustomEvent('carbontrack:auth-changed', {
                detail: { user: this.currentUser, event: 'SIGNED_IN' }
            }));

            if (window.location.pathname.includes('login.html')) {
                const params = new URLSearchParams(window.location.search);
                const target = params.get('redirect') || 'calculator.html';
                setTimeout(() => {
                    window.location.href = target;
                }, 700);
            }
        },

        /**
         * Sign In with Email and Password
         */
        async signInWithEmail(email, password) {
            if (!this.supabase) {
                this.showNotice('Supabase SDK unavailable.', 'error');
                return { error: new Error('Supabase client unavailable') };
            }

            try {
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    this.showNotice(error.message, 'error');
                    return { error };
                }

                if (data && data.user) {
                    this.currentUser = data.user;
                    this.currentSession = data.session;
                    this.isDemo = false;
                    localStorage.removeItem(DEMO_STORAGE_KEY);
                    this.updateUI();
                    this.showNotice(`Welcome back, ${data.user.email}!`, 'success');
                    window.dispatchEvent(new CustomEvent('carbontrack:auth-changed', {
                        detail: { user: this.currentUser, event: 'SIGNED_IN' }
                    }));

                    // If on login.html, navigate to calculator or redirect target
                    if (window.location.pathname.includes('login.html')) {
                        const params = new URLSearchParams(window.location.search);
                        const target = params.get('redirect') || 'calculator.html';
                        setTimeout(() => {
                            window.location.href = target;
                        }, 700);
                    }
                }

                return { data };
            } catch (err) {
                this.showNotice(err.message || 'Error signing in', 'error');
                return { error: err };
            }
        },

        /**
         * Sign Up with Email and Password
         */
        async signUpWithEmail(email, password, fullName) {
            if (!this.supabase) {
                this.showNotice('Supabase SDK unavailable.', 'error');
                return { error: new Error('Supabase client unavailable') };
            }

            try {
                const { data, error } = await this.supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName || email.split('@')[0],
                            provider: 'email'
                        }
                    }
                });

                if (error) {
                    this.showNotice(error.message, 'error');
                    return { error };
                }

                if (data && data.user) {
                    if (data.session) {
                        this.currentUser = data.user;
                        this.currentSession = data.session;
                        this.isDemo = false;
                        localStorage.removeItem(DEMO_STORAGE_KEY);
                        this.updateUI();
                        this.showNotice(`Account created successfully! Welcome, ${data.user.email}!`, 'success');

                        // If on login.html, navigate to calculator or redirect target
                        if (window.location.pathname.includes('login.html')) {
                            const params = new URLSearchParams(window.location.search);
                            const target = params.get('redirect') || 'calculator.html';
                            setTimeout(() => {
                                window.location.href = target;
                            }, 800);
                        }
                    } else {
                        this.showNotice('Account created! If email confirmation is required, please check your inbox.', 'info');
                    }

                    window.dispatchEvent(new CustomEvent('carbontrack:auth-changed', {
                        detail: { user: this.currentUser, event: 'SIGNED_UP' }
                    }));
                }

                return { data };
            } catch (err) {
                this.showNotice(err.message || 'Error creating account', 'error');
                return { error: err };
            }
        },

        /**
         * Sign Out from both Supabase & Demo sessions.
         * Shows a warning & takes explicit user consent before logging out.
         * @param {boolean} [force=false] - If true, bypasses consent prompt and logs out immediately.
         */
        async signOut(force = false) {
            if (!force) {
                this.promptSignOutConsent();
                return;
            }

            try {
                if (this.supabase && !this.isDemo) {
                    await this.supabase.auth.signOut();
                }
            } catch (e) {
                console.warn('Error signing out of Supabase:', e);
            }

            localStorage.removeItem(DEMO_STORAGE_KEY);
            this.currentUser = null;
            this.currentSession = null;
            this.isDemo = false;

            this.updateUI();
            this.showNotice('You have been signed out successfully.', 'info');

            window.dispatchEvent(new CustomEvent('carbontrack:auth-changed', {
                detail: { user: null, event: 'SIGNED_OUT' }
            }));

            // If user signed out while on protected service pages, redirect gracefully to home
            const currentPath = window.location.pathname.toLowerCase();
            if (currentPath.includes('calculator.html') || currentPath.includes('planner.html')) {
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        },

        /**
         * Display the Sign Out Warning & Consent Confirmation Modal
         */
        promptSignOutConsent() {
            let backdrop = document.getElementById('auth-consent-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'auth-consent-backdrop';
                backdrop.className = 'auth-consent-backdrop';
                backdrop.setAttribute('role', 'dialog');
                backdrop.setAttribute('aria-modal', 'true');
                backdrop.setAttribute('aria-labelledby', 'auth-consent-title');
                document.body.appendChild(backdrop);
            }

            const user = this.getUser();
            const userEmail = (user && user.email) ? user.email : 'Current User';
            const userName = (user && user.user_metadata && user.user_metadata.full_name) 
                ? user.user_metadata.full_name 
                : userEmail.split('@')[0];

            backdrop.innerHTML = `
                <div class="auth-consent-modal" id="auth-consent-modal">
                    <button class="auth-consent-close-btn" id="btn-consent-close" type="button" aria-label="Cancel and close dialog">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="auth-consent-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                    <h3 class="auth-consent-title" id="auth-consent-title">Sign Out of Code2Carbon?</h3>
                    <p class="auth-consent-body">
                        Are you sure you want to log out? Any unsaved carbon footprint inputs or unsubmitted calculations in this session will not be preserved.
                    </p>
                    <div class="auth-consent-user-chip">
                        <span class="dot"></span>
                        <span>Signed in as <strong>${userName}</strong> (${userEmail})</span>
                    </div>
                    <div class="auth-consent-actions">
                        <button type="button" class="auth-consent-btn auth-consent-btn-cancel" id="btn-consent-cancel">
                            Stay Signed In
                        </button>
                        <button type="button" class="auth-consent-btn auth-consent-btn-confirm" id="btn-consent-confirm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span>Yes, Log Out</span>
                        </button>
                    </div>
                </div>
            `;

            // Animate opening
            requestAnimationFrame(() => {
                backdrop.classList.add('active');
            });

            const self = this;

            const closeModal = () => {
                backdrop.classList.remove('active');
                document.removeEventListener('keydown', handleKeydown);
            };

            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            };

            document.addEventListener('keydown', handleKeydown);

            const cancelBtn = backdrop.querySelector('#btn-consent-cancel');
            if (cancelBtn) {
                cancelBtn.onclick = (e) => {
                    e.preventDefault();
                    closeModal();
                };
            }

            const closeBtn = backdrop.querySelector('#btn-consent-close');
            if (closeBtn) {
                closeBtn.onclick = (e) => {
                    e.preventDefault();
                    closeModal();
                };
            }

            const confirmBtn = backdrop.querySelector('#btn-consent-confirm');
            if (confirmBtn) {
                confirmBtn.onclick = (e) => {
                    e.preventDefault();
                    closeModal();
                    self.signOut(true);
                };
            }

            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    closeModal();
                }
            };
        },

        /**
         * Send Password Reset Email
         */
        async resetPassword(email) {
            if (!email) {
                this.showNotice('Please enter your email address to reset password.', 'error');
                return;
            }
            if (!this.supabase) {
                this.showNotice('Supabase SDK is not available.', 'error');
                return;
            }
            try {
                const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + window.location.pathname
                });
                if (error) {
                    this.showNotice(error.message, 'error');
                } else {
                    this.showNotice(`Password reset link sent to ${email}. Check your inbox.`, 'success');
                }
            } catch (e) {
                this.showNotice(e.message || 'Failed to send reset link.', 'error');
            }
        },

        /**
         * Save an assessment specifically for the current logged-in user
         */
        async saveUserAssessment(assessmentData) {
            const userKey = this.getUserStorageKey();
            const user = this.currentUser;

            const record = {
                id: 'sub_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                created_at: new Date().toISOString(),
                user_id: user ? (user.id || null) : null,
                user_email: user ? (user.email || null) : (assessmentData.email || 'anonymous'),
                provider: this.isDemo ? 'google-demo' : (user?.app_metadata?.provider || user?.user_metadata?.provider || 'supabase'),
                ...assessmentData
            };

            // 1. Save to persistent user-scoped local list
            try {
                const storageKey = SUBMISSIONS_STORAGE_PREFIX + userKey;
                const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
                existing.unshift(record);
                localStorage.setItem(storageKey, JSON.stringify(existing.slice(0, 50))); // Keep last 50
            } catch (err) {
                console.warn('Error saving to local storage:', err);
            }

            // 2. Also try inserting to Supabase table `emissions_submissions`
            if (!this.supabase && typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                const cfg = window.CarbonTrackConfig || {};
                const env = window.__ENV__ || {};
                const url = (cfg.SUPABASE_URL || env.SUPABASE_URL || '').trim();
                const key = (cfg.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || '').trim();
                if (url && key && !url.includes('your-project')) {
                    try {
                        this.supabase = window.supabase.createClient(url, key);
                        window.supabaseClient = this.supabase;
                    } catch (e) {
                        console.warn('Could not re-init Supabase client:', e);
                    }
                }
            }

            if (this.supabase) {
                const rowData = {
                    organization_name: assessmentData.organization_name || 'Not provided',
                    address: assessmentData.address || 'Not provided',
                    contact_number: assessmentData.contact_number || 'Not provided',
                    email: record.user_email || 'anonymous',
                    student_count: parseInt(assessmentData.student_count) || 0,
                    paper_emissions_kg: parseFloat(assessmentData.paper_emissions_kg) || 0,
                    lpg_emissions_kg: parseFloat(assessmentData.lpg_emissions_kg) || 0,
                    electricity_emissions_kg: parseFloat(assessmentData.electricity_emissions_kg) || 0,
                    generator_emissions_kg: parseFloat(assessmentData.generator_emissions_kg) || 0,
                    vehicle_emissions_kg: parseFloat(assessmentData.vehicle_emissions_kg) || 0,
                    solar_offset_kg: parseFloat(assessmentData.solar_offset_kg) || 0,
                    tree_sink_kg: parseFloat(assessmentData.tree_sink_kg) || 0,
                    net_footprint_kg: parseFloat(assessmentData.net_footprint_kg) || 0
                };

                const { data: dbData, error: dbErr } = await this.supabase
                    .from('emissions_submissions')
                    .insert([rowData])
                    .select();

                if (dbErr) {
                    console.error('Supabase DB insert error:', dbErr);
                    throw new Error(dbErr.message || JSON.stringify(dbErr));
                } else {
                    console.log('Successfully saved assessment to Supabase emissions_submissions:', dbData);
                }
            } else {
                throw new Error('Supabase client is not connected. Check SUPABASE_URL / key configuration.');
            }

            // Update UI counts
            this.updateUI();
            return record;
        },

        /**
         * Retrieve past assessments for the current user
         */
        async getUserAssessments() {
            const userKey = this.getUserStorageKey();
            const storageKey = SUBMISSIONS_STORAGE_PREFIX + userKey;
            let localRecords = [];

            try {
                localRecords = JSON.parse(localStorage.getItem(storageKey) || '[]');
            } catch (e) {
                localRecords = [];
            }

            // Also attempt to query Supabase if available and user is authenticated
            if (this.supabase && this.currentUser && !this.isDemo) {
                try {
                    const userEmail = this.currentUser.email;
                    const { data, error } = await this.supabase
                        .from('emissions_submissions')
                        .select('*')
                        .eq('email', userEmail)
                        .order('created_at', { ascending: false })
                        .limit(20);

                    if (!error && Array.isArray(data) && data.length > 0) {
                        // Merge records by id/timestamp
                        const knownIds = new Set(localRecords.map(r => r.id));
                        data.forEach(dbItem => {
                            if (!knownIds.has(dbItem.id)) {
                                localRecords.push({
                                    id: dbItem.id || ('db_' + Date.now()),
                                    created_at: dbItem.created_at || new Date().toISOString(),
                                    organization_name: dbItem.organization_name,
                                    address: dbItem.address,
                                    contact_number: dbItem.contact_number,
                                    email: dbItem.email,
                                    student_count: dbItem.student_count,
                                    paper_emissions_kg: dbItem.paper_emissions_kg,
                                    lpg_emissions_kg: dbItem.lpg_emissions_kg,
                                    electricity_emissions_kg: dbItem.electricity_emissions_kg,
                                    generator_emissions_kg: dbItem.generator_emissions_kg,
                                    vehicle_emissions_kg: dbItem.vehicle_emissions_kg,
                                    solar_offset_kg: dbItem.solar_offset_kg,
                                    tree_sink_kg: dbItem.tree_sink_kg,
                                    net_footprint_kg: dbItem.net_footprint_kg,
                                    isCloudSynced: true
                                });
                            }
                        });
                    }
                } catch (err) {
                    console.warn('Could not fetch remote submissions:', err);
                }
            }

            return localRecords;
        },

        /**
         * Reactive UI Updates across desktop/mobile navbars and login/profile sections
         */
        async updateUI() {
            const user = this.currentUser;
            const isAuthenticated = !!user;

            const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
            const displayEmail = user?.email || '';
            const initial = (displayName.charAt(0) || displayEmail.charAt(0) || 'U').toUpperCase();
            const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
            const providerName = this.isDemo ? 'Google Account (Demo)' : (user?.app_metadata?.provider || user?.user_metadata?.provider || 'Verified Session');

            // --- 1. Top Navbar Sync ---
            const loginNavTrigger = document.getElementById('login-nav-trigger');
            const navActions = document.querySelector('.nav-actions');

            let navUserChip = document.getElementById('nav-user-chip');

            if (isAuthenticated) {
                if (loginNavTrigger) {
                    loginNavTrigger.style.display = 'none';
                }

                if (!navUserChip && navActions) {
                    navUserChip = document.createElement('div');
                    navUserChip.id = 'nav-user-chip';
                    navUserChip.className = 'nav-user-chip';
                    navUserChip.title = `Signed in as ${displayEmail}`;
                    navActions.insertBefore(navUserChip, navActions.firstChild);
                }

                if (navUserChip) {
                    navUserChip.style.display = 'inline-flex';
                    navUserChip.innerHTML = `
                        <div class="nav-avatar-mini" id="nav-avatar-mini">
                            ${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar">` : initial}
                        </div>
                        <span id="nav-user-email" style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${displayName}</span>
                        <button class="btn-logout-nav-icon" id="btn-logout-nav" title="Sign Out (${displayEmail})" type="button">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    `;

                    const logoutBtn = navUserChip.querySelector('#btn-logout-nav');
                    if (logoutBtn) {
                        logoutBtn.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            CarbonAuth.signOut();
                        };
                    }
                }

                // Reveal Protected Navigation Items (Calculator, Planner)
                const protectedNavItems = document.querySelectorAll('.nav-item-protected');
                protectedNavItems.forEach(el => {
                    el.style.display = el.tagName === 'LI' ? 'list-item' : 'inline-block';
                });

                // Update Hero / CTA Get Started button to jump directly to calculator when logged in
                const heroGetStartedCta = document.getElementById('hero-get-started-cta');
                if (heroGetStartedCta) {
                    heroGetStartedCta.setAttribute('href', 'calculator.html');
                    const ctaText = heroGetStartedCta.querySelector('span');
                    if (ctaText) ctaText.textContent = 'Go to Calculator';
                }
                const ctaGetStartedBtn = document.getElementById('cta-get-started-btn');
                if (ctaGetStartedBtn) {
                    ctaGetStartedBtn.setAttribute('href', 'calculator.html');
                    const ctaText = ctaGetStartedBtn.querySelector('span');
                    if (ctaText) ctaText.textContent = 'Go to Calculator';
                }
                const ctaLoginBtn = document.getElementById('cta-login-btn');
                if (ctaLoginBtn) {
                    ctaLoginBtn.textContent = 'Sign Out (' + displayName + ')';
                    ctaLoginBtn.onclick = (e) => {
                        e.preventDefault();
                        CarbonAuth.signOut();
                    };
                }

                // Mobile Nav Link
                const mobileLoginLinks = document.querySelectorAll('.nav-btn-login-mobile');
                mobileLoginLinks.forEach(link => {
                    link.textContent = `Sign Out (${displayName})`;
                    link.setAttribute('href', '#');
                    link.onclick = (e) => {
                        e.preventDefault();
                        CarbonAuth.signOut();
                    };
                });
            } else {
                if (loginNavTrigger) {
                    loginNavTrigger.style.display = 'inline-block';
                    loginNavTrigger.setAttribute('href', 'login.html');
                }
                if (navUserChip) {
                    navUserChip.style.display = 'none';
                }

                // Hide Protected Navigation Items (Calculator, Planner)
                const protectedNavItems = document.querySelectorAll('.nav-item-protected');
                protectedNavItems.forEach(el => {
                    el.style.display = 'none';
                });

                // Reset Hero / CTA Get Started buttons to route to login.html
                const heroGetStartedCta = document.getElementById('hero-get-started-cta');
                if (heroGetStartedCta) {
                    heroGetStartedCta.setAttribute('href', 'login.html?redirect=calculator.html');
                    const ctaText = heroGetStartedCta.querySelector('span');
                    if (ctaText) ctaText.textContent = 'Get Started';
                }
                const ctaGetStartedBtn = document.getElementById('cta-get-started-btn');
                if (ctaGetStartedBtn) {
                    ctaGetStartedBtn.setAttribute('href', 'login.html?redirect=calculator.html');
                    const ctaText = ctaGetStartedBtn.querySelector('span');
                    if (ctaText) ctaText.textContent = 'Get Started';
                }
                const ctaLoginBtn = document.getElementById('cta-login-btn');
                if (ctaLoginBtn) {
                    ctaLoginBtn.textContent = 'Institutional Sign In';
                    ctaLoginBtn.setAttribute('href', 'login.html');
                    ctaLoginBtn.onclick = null;
                }

                const mobileLoginLinks = document.querySelectorAll('.nav-btn-login-mobile');
                mobileLoginLinks.forEach(link => {
                    link.textContent = 'Login';
                    link.setAttribute('href', 'login.html');
                    link.onclick = null;
                });
            }

            // --- 2. Login Section / Auth Profile on index.html ---
            const loginCardForm = document.getElementById('login-form');
            const authProfileCard = document.getElementById('auth-profile-card');
            const authTabs = document.getElementById('auth-tabs');
            const googleLoginBtn = document.getElementById('btn-google-login');
            const loginDivider = document.querySelector('.login-card .divider');
            const loginFooter = document.querySelector('.login-footer-text');
            const loginHeaderTitle = document.querySelector('.login-header h3');
            const loginHeaderDesc = document.querySelector('.login-header p');

            if (isAuthenticated) {
                // Hide inputs and show Profile Card
                if (loginCardForm) loginCardForm.style.display = 'none';
                if (authTabs) authTabs.style.display = 'none';
                if (googleLoginBtn) googleLoginBtn.style.display = 'none';
                if (loginDivider) loginDivider.style.display = 'none';
                if (loginFooter) loginFooter.style.display = 'none';
                if (loginHeaderTitle) loginHeaderTitle.textContent = 'Account Dashboard';
                if (loginHeaderDesc) loginHeaderDesc.textContent = 'Active CarbonTrack session with verified user storage';

                if (authProfileCard) {
                    authProfileCard.style.display = 'block';

                    const avatarEl = authProfileCard.querySelector('#auth-profile-avatar');
                    const nameEl = authProfileCard.querySelector('#auth-profile-name');
                    const emailEl = authProfileCard.querySelector('#auth-profile-email');
                    const providerEl = authProfileCard.querySelector('#auth-provider-badge');
                    const countEl = authProfileCard.querySelector('#auth-submissions-count');

                    if (avatarEl) {
                        avatarEl.innerHTML = avatarUrl ? `<img src="${avatarUrl}" alt="Avatar">` : initial;
                    }
                    if (nameEl) nameEl.textContent = displayName;
                    if (emailEl) emailEl.textContent = displayEmail;
                    if (providerEl) providerEl.textContent = `Connected via ${providerName}`;

                    // Update count of saved submissions
                    this.getUserAssessments().then(records => {
                        if (countEl) {
                            countEl.textContent = `${records.length} assessment${records.length === 1 ? '' : 's'} recorded`;
                        }
                    });

                    const signOutBtn = authProfileCard.querySelector('#btn-auth-signout');
                    if (signOutBtn) {
                        signOutBtn.onclick = (e) => {
                            e.preventDefault();
                            CarbonAuth.signOut();
                        };
                    }
                }
            } else {
                // Show form, hide profile card
                if (loginCardForm) loginCardForm.style.display = 'flex';
                if (authTabs) authTabs.style.display = 'flex';
                if (googleLoginBtn) googleLoginBtn.style.display = 'flex';
                if (loginDivider) loginDivider.style.display = 'block';
                if (loginFooter) loginFooter.style.display = 'block';
                if (loginHeaderTitle) loginHeaderTitle.textContent = 'Welcome Back';
                if (loginHeaderDesc) loginHeaderDesc.textContent = 'Access your personal carbon assessment tracker';

                if (authProfileCard) {
                    authProfileCard.style.display = 'none';
                }
            }

            // --- 3. Calculator Page Auto-Fill & Banner Sync ---
            const orgEmailInput = document.getElementById('org-email');
            if (orgEmailInput && isAuthenticated && !orgEmailInput.value) {
                orgEmailInput.value = displayEmail;
            }

            // Sync user indicator in calculator summary if element exists
            const calcUserIndicator = document.getElementById('calc-user-session-indicator');
            if (calcUserIndicator) {
                if (isAuthenticated) {
                    calcUserIndicator.style.display = 'inline-flex';
                    calcUserIndicator.innerHTML = `
                        <span class="auth-badge-dot"></span>
                        <span>Saving data for: <strong>${displayEmail}</strong> (${providerName})</span>
                    `;
                } else {
                    calcUserIndicator.style.display = 'none';
                }
            }
        },

        /**
         * Global Toast / Notice Helper
         */
        showNotice(message, type = 'info') {
            const container = document.getElementById('toast-container');
            if (!container) {
                alert(message);
                return;
            }

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.style.display = 'flex';
            toast.style.alignItems = 'center';
            toast.style.gap = '10px';

            const iconMap = {
                success: '✓',
                error: '✕',
                info: 'ℹ'
            };

            toast.innerHTML = `
                <span style="font-weight: 700; background: rgba(255,255,255,0.2); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">
                    ${iconMap[type] || 'ℹ'}
                </span>
                <span>${message}</span>
            `;

            container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 80);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 400);
            }, 4500);
        },

        /**
         * Attach UI Event Handlers
         */
        bindEvents() {
            // Google Login Button on page
            const googleBtn = document.getElementById('btn-google-login');
            if (googleBtn) {
                googleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    CarbonAuth.signInWithGoogle();
                });
            }

            // Forgot password link
            const forgotLink = document.querySelector('.forgot-pass');
            if (forgotLink) {
                forgotLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const emailInput = document.getElementById('login-email');
                    const emailVal = emailInput ? emailInput.value.trim() : '';
                    if (!emailVal) {
                        CarbonAuth.showNotice('Please enter your email above and click "Forgot password?" again.', 'info');
                        if (emailInput) emailInput.focus();
                    } else {
                        CarbonAuth.resetPassword(emailVal);
                    }
                });
            }

            // Login / Signup Form
            const form = document.getElementById('login-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const activeTab = document.querySelector('.auth-tab-btn.active')?.dataset.tab || 'signin';
                    const email = document.getElementById('login-email')?.value?.trim();
                    const password = document.getElementById('login-password')?.value;
                    const fullName = document.getElementById('login-name')?.value?.trim();

                    if (!email || !password) {
                        CarbonAuth.showNotice('Please provide both email and password.', 'error');
                        return;
                    }

                    if (password.length < 6) {
                        CarbonAuth.showNotice('Password must be at least 6 characters long.', 'error');
                        return;
                    }

                    const submitBtn = document.getElementById('btn-auth-submit');
                    const origBtnText = submitBtn ? submitBtn.textContent : '';
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.textContent = 'Authenticating...';
                    }

                    try {
                        if (activeTab === 'signup') {
                            await CarbonAuth.signUpWithEmail(email, password, fullName);
                        } else {
                            await CarbonAuth.signInWithEmail(email, password);
                        }
                    } finally {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = origBtnText;
                        }
                    }
                });
            }

            // Auth tabs (Sign In vs Create Account)
            const tabBtns = document.querySelectorAll('.auth-tab-btn');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const tab = btn.dataset.tab;
                    const nameGroup = document.getElementById('signup-name-group');
                    const submitBtn = document.getElementById('btn-auth-submit');
                    const actionsRow = document.querySelector('.login-actions-row');

                    if (tab === 'signup') {
                        if (nameGroup) nameGroup.style.display = 'block';
                        if (submitBtn) submitBtn.textContent = 'Create Account';
                        if (actionsRow) actionsRow.style.display = 'none';
                    } else {
                        if (nameGroup) nameGroup.style.display = 'none';
                        if (submitBtn) submitBtn.textContent = 'Sign In';
                        if (actionsRow) actionsRow.style.display = 'flex';
                    }
                });
            });

            // "Create account" link in footer
            const createAccLink = document.getElementById('link-toggle-signup');
            if (createAccLink) {
                createAccLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const signupTabBtn = document.getElementById('tab-btn-signup');
                    if (signupTabBtn) signupTabBtn.click();
                });
            }
        }
    };

    // Expose to window immediately
    window.CarbonAuth = CarbonAuth;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CarbonAuth.init());
    } else {
        CarbonAuth.init();
    }
})();
