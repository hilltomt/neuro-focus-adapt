# NEURO

**Live demo:** [https://neuroadapttool.lovable.app/](https://neuroadapttool.lovable.app/)

A web application that helps teachers adapt learning materials for neurodiverse students. Built with React + Vite and powered by Supabase and the Dust AI platform.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite 5, Tailwind CSS 3
- **UI Components:** Radix UI primitives via shadcn/ui
- **Routing:** React Router v6
- **State / Data Fetching:** TanStack React Query
- **Backend-as-a-Service:** Supabase (Auth, PostgreSQL, Storage, Edge Functions)
- **AI Assistant:** Dust AI (called via a Supabase Edge Function)
<!-- - **Auth:** Supabase Auth (email/password) + Lovable Cloud Auth (Google OAuth) -->

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Static SPA (Vite build)                    │
│  React · React Router · TanStack Query      │
└────────────┬────────────────────────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────────────────┐
│  Supabase                                   │
│  ┌──────────┐ ┌────────┐ ┌───────────────┐  │
│  │ Auth     │ │Postgres│ │ Storage       │  │
│  │(email/pw │ │profiles│ │(lesson-files) │  │
│  │ + OAuth) │ │adaption│ │               │  │
│  └──────────┘ └────────┘ └───────────────┘  │
│  ┌────────────────────────────────────────┐ │
│  │ Edge Function: dust-chat (Deno)        │ │
│  │ → proxies requests to Dust AI API      │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Prerequisites

- **Node.js** >= 18 (or **Bun**)
- **npm** (or Bun)
- A **Supabase** project (free tier works)
- A **Dust** workspace with an API key (for the AI assistant)

## Environment Variables

### Client-side (Vite)

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
VITE_SUPABASE_PROJECT_ID=<your-supabase-project-id>
```

### Server-side (Supabase Edge Function secrets)

Set these via the Supabase Dashboard or CLI (`supabase secrets set`):

```
DUST_API_KEY=<your-dust-api-key>
DUST_WORKSPACE_ID=<your-dust-workspace-id>
```

## Local Development

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:8080)
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server on port 8080 |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Development build (unminified, with source maps) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run Vitest in watch mode |

## Database Setup (Supabase)

The project includes SQL migrations under `supabase/migrations/`. Apply them using the Supabase CLI:

```bash
# Link to your Supabase project
supabase link --project-ref <your-project-id>

# Push migrations to your remote database
supabase db push
```

### Database Schema

- **`profiles`** — User profile data (full name, school, subject area, avatar). Auto-created on signup via a database trigger. Row-Level Security ensures users can only access their own profile.
- **`adaptations`** — Stores adaptation history (original content, adapted content, strategies used). RLS-protected per user.
- **`storage.lesson-files`** — Public bucket for teacher-uploaded lesson files. Authenticated users can upload/read; users can only delete files in their own folder.

## Deploying the Edge Function

The `dust-chat` Edge Function proxies chat messages to the Dust AI agent. Deploy it with:

```bash
supabase functions deploy dust-chat
```

Make sure the `DUST_API_KEY` and `DUST_WORKSPACE_ID` secrets are set in your Supabase project before invoking the function.

## Deployment (Frontend)

The frontend is a static single-page application. After running `npm run build`, the output in `dist/` can be deployed to any static hosting provider:

### Lovable Hosting

If you created this project on [Lovable](https://lovable.dev), the app is automatically deployed when you push changes. No additional configuration is needed.

### Netlify / Vercel / Cloudflare Pages

1. Connect your Git repository to the platform.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Add the `VITE_*` environment variables in the platform's settings.
5. For SPA routing, configure a redirect rule so all paths serve `index.html`:
   - **Netlify:** add a `_redirects` file in `public/` with `/* /index.html 200`
   - **Vercel:** add a `vercel.json` with `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`

### Manual / Self-hosted

```bash
npm run build
# Serve dist/ with any static file server, e.g.:
npx serve dist
```

## Project Structure

```
neuro-focus-adapt/
├── public/                  # Static assets
├── src/
│   ├── components/          # UI components
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── student/         # Student-specific views
│   │   ├── teacher/         # Teacher-specific views
│   │   └── assistant/       # AI assistant components
│   ├── contexts/            # React context providers (Auth)
│   ├── hooks/               # Custom React hooks
│   ├── integrations/
│   │   ├── supabase/        # Supabase client + generated types
│   │   └── lovable/         # Lovable cloud auth wrapper
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route page components
│   ├── test/                # Test setup
│   ├── App.tsx              # Root component with routing
│   └── main.tsx             # Entry point
├── supabase/
│   ├── config.toml          # Supabase project config
│   ├── migrations/          # SQL migrations
│   └── functions/
│       └── dust-chat/       # Edge Function (Deno) for Dust AI
├── .env                     # Local environment variables (do not commit)
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## License

This project was generated with [Lovable](https://lovable.dev).
