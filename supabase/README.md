# Supabase Edge Function: `generate-insights`

This directory contains the secure server-side Edge Function that calls Google Gemini API to generate institution-specific environmental insights, hotspot analysis, and engineering recommendations for the CarbonTrack report generator.

## Security Architecture
- The Google Gemini API key is **never** exposed to client-side code, HTML, or GitHub.
- The API key is stored securely in **Supabase Secrets** under the key `GEMINI_API_KEY`.
- The frontend client sends the authoritative calculated carbon assessment payload to the Edge Function, which queries Gemini and returns structured JSON insights.
- If the Edge Function or Gemini API key is not configured, the CarbonTrack frontend automatically falls back to an integrated deterministic analytics engine, transparently labeling the output.

---

## Deployment Instructions

### 1. Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

### 2. Login & Link Your Supabase Project
```bash
supabase login
supabase link --project-ref gqwupemhxhbfxfcraggw
```
*(Replace `gqwupemhxhbfxfcraggw` with your Supabase Project Ref if using a different instance)*

### 3. Set the Gemini API Key in Supabase Secrets
Get your Gemini API Key from [Google AI Studio](https://aistudio.google.com/):
```bash
supabase secrets set GEMINI_API_KEY="your-google-ai-studio-gemini-api-key"
```

### 4. Deploy the Function
```bash
supabase functions deploy generate-insights --no-verify-jwt
```
*(Or keep JWT verification enabled if passing the Anon Key / User Bearer token in the client headers)*

---

## Google OAuth & User Session Authentication

CarbonTrack includes comprehensive user authentication and persistent session management supporting:
1. **Google OAuth 2.0 (via Supabase Auth)**
2. **Email & Password Authentication**
3. **Session Persistence**: Stored via Supabase tokens in `localStorage`
4. **User-Scoped Assessment Storage**: Each carbon emission calculation is automatically saved under the logged-in user's account in Supabase (`emissions_submissions`) and synchronized locally.

### Activating Google Login in Supabase Dashboard:
1. Go to your [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. In Supabase Dashboard for project `gqwupemhxhbfxfcraggw`:
   - Navigate to **Authentication** -> **Providers** -> **Google**.
   - Enable the Google provider.
   - Enter your Google **Client ID** and **Client Secret**.
   - Add Supabase's Authorized Redirect URI (shown in Supabase Dashboard) to Google Cloud Console's *Authorized redirect URIs*:
     `https://gqwupemhxhbfxfcraggw.supabase.co/auth/v1/callback`
4. Save changes. Users clicking **"Sign in with Google"** on CarbonTrack will authenticate directly through Google and have their institutional carbon audits permanently linked to their account.
