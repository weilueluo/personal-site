## Personal Website (Next.js App Router)

This is the modernized version of the personal website with App Router, TailwindCSS, shadcn/ui, React Hook Form + Zod,
i18n, and dark/light mode.

### Getting Started

Requires Node.js 22 (see `.nvmrc`).

```bash
pnpm install
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in values.

Required:
- `NEXT_PUBLIC_G_TAG` (Google Analytics)
- `GITHUB_TOKEN` (read-only token for GitHub blog content)
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (preferred) or `SUPABASE_PUBLISHABLE_KEY` with RLS enabled
- `POSTMARK_SERVER_TOKEN`
- `POSTMARK_FROM`
- `POSTMARK_TO`

Optional:
- `POSTMARK_MESSAGE_STREAM`
- `DEFAULT_REVALIDATE`

### Supabase Schema

Schema + RLS are managed with Supabase CLI migrations in `supabase/migrations`.

Apply migrations:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

The initial migration creates the `comments` table and RLS policies for read/insert.

### CI/CD

- **Deploys**: Use Vercel GitHub integration (no deploy workflow required).
- **Supabase migrations**: GitHub Actions workflow `.github/workflows/supabase-migrate.yml`.

Required GitHub secrets:
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`

Manual run:

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

### Archive

Legacy sites are available under `/archive/2019` and `/archive/2021`.
