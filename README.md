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
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTMARK_SERVER_TOKEN`
- `POSTMARK_FROM`
- `POSTMARK_TO`

Optional:
- `POSTMARK_MESSAGE_STREAM`
- `DEFAULT_REVALIDATE`

### Supabase Schema

Create a `comments` table for blog comments:

```sql
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_filename_idx on public.comments (filename);
```

### Archive

Legacy sites are available under `/archive/2019` and `/archive/2021`.
