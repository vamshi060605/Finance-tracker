# Personal Finance Tracker Documentation

## Overview
Personal Finance Tracker is a web application built with Next.js that helps users manage their finances using the 50/30/20 budgeting rule.

## Features
- Transaction management
- Budget tracking
- Expense categorization
- Financial analytics
- Multi-currency support
- Dark/light theme

## Technical Stack
- Frontend: Next.js, React, TypeScript
- Backend: Supabase
- UI: Tailwind CSS, shadcn/ui
- Charts: Recharts

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
   ```
4. Run development server: `npm run dev`

## Architecture
The application follows a client-side architecture with:
- Page-based routing
- Component-based UI
- Server-side data fetching
- Real-time updates via Supabase

## Data Models
### Transaction
- id: number
- user_id: string
- name: string
- amount: number
- type: 'income' | 'expense'
- category: 'needs' | 'wants' | 'savings'
- date: string
- description: string

### Monthly Allocation
- id: number
- user_id: string
- needs_budget: number
- wants_budget: number
- savings_budget: number
- month: string

## Error Handling
The application implements centralized error handling through the `errors.ts` utility.
See `src/lib/errors.ts` for implementation details.
