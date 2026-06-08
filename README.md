# Deal Builder

Production-ready frontend foundation for a modern SaaS web application.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Shadcn UI** (Radix primitives)
- **Lucide React**
- **Zustand**
- **React Hook Form + Zod**
- **Framer Motion**
- **Sonner** (toasts)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/
│   ├── ui/               # Primitive UI components (Button, Input, etc.)
│   ├── common/           # App-wide providers and utilities
│   ├── forms/            # Form field wrappers
│   ├── layouts/          # AppShell, Sidebar, Topbar, Page layouts
│   ├── feedback/         # Alerts, toasts, loading states
│   ├── data-display/     # Cards, tables, key-value lists
│   └── navigation/       # Nav links, breadcrumbs, theme switcher
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── store/                # Zustand state stores
├── types/                # Shared TypeScript types
├── styles/               # Design tokens and global CSS
└── constants/            # Navigation config, mock data
```

## Design System

- CSS variable tokens in `src/styles/tokens.css`
- Light and dark theme support
- Typography scale utility classes
- Consistent spacing system (4–80px)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
