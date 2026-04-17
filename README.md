# Bug Bros — Team Portfolio Platform

A production-ready team portfolio web application built with Next.js 14, TypeScript, Tailwind CSS v4, and Supabase.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Database & Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project ([create one here](https://supabase.com))

### 1. Install Dependencies

```bash
cd bug-bros
npm install
```

### 2. Set Up Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (optional)
```

### 3. Set Up Supabase Database

Run these SQL files **in order** in your Supabase SQL Editor:

1. **`supabase/schema.sql`** — Creates all tables, triggers, and indexes
2. **`supabase/rls_policies.sql`** — Enables Row Level Security with appropriate policies
3. **`supabase/storage.sql`** — Creates storage buckets and their access policies

### 4. Create an Admin User

1. Sign up a user via the login page or Supabase Auth dashboard
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'your-admin@email.com';
   ```
   
   If the user doesn't exist in the `users` table yet, insert them:
   ```sql
   INSERT INTO public.users (id, full_name, email, role)
   VALUES (
     'auth-user-uuid-from-supabase',
     'Your Name',
     'your@email.com',
     'admin'
   );
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
bug-bros/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, theme, overlays)
│   ├── page.tsx            # Home page
│   ├── team/               # Team list + detail pages
│   ├── projects/           # Projects list + detail pages
│   ├── achievements/       # Achievements page
│   ├── about/              # About page
│   ├── contact/            # Contact form
│   ├── login/              # Admin login
│   └── admin/              # Admin panel (protected)
│       ├── dashboard/      # Stats overview
│       ├── members/        # CRUD users
│       ├── projects/       # CRUD projects
│       ├── achievements/   # CRUD achievements
│       ├── experiences/    # CRUD experiences
│       └── messages/       # View/delete messages
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Navbar, Footer, GridLines, NoiseOverlay
│   └── admin/              # DataTable, ImageUpload, MultiSelect, TagsInput
├── lib/
│   ├── supabase/           # Server + client Supabase instances
│   ├── queries/            # Data fetching functions
│   └── types/              # TypeScript type definitions
├── supabase/               # SQL setup files
└── middleware.ts            # Auth session + admin route protection
```

## Design System

- **Theme**: Luxury editorial + hacker aesthetic
- **Colors**: Warm bg (#F9F8F6), dark fg (#1A1A1A), gold accent (#D4AF37)
- **Typography**: Playfair Display (headings) + Inter (body)
- **Effects**: Paper noise texture, vertical grid lines, grayscale→color hover (1500ms), gold sliding button animation, extreme typography scale, vertical text labels
- **Dark Mode**: Class-based toggle with localStorage persistence

## Deployment to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | Team members with profiles, skills, social links |
| `projects` | Team projects with tech stack, screenshots |
| `achievements` | Hackathon/CTF/other wins |
| `experiences` | Work experience entries (linked to users) |
| `contributors` | Junction: projects ↔ users |
| `participants` | Junction: achievements ↔ users |
| `contact_messages` | Contact form submissions |
| `about_content` | Dynamic about page content |

## License

MIT
