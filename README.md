# Personal Finance Tracker

A modern web application for managing personal finances using the 50/30/20 budgeting rule.

## Overview

Personal Finance Tracker helps users manage their finances by:
- Tracking income and expenses
- Categorizing transactions into needs (50%), wants (30%), and savings (20%)
- Providing visual analytics of spending patterns
- Supporting multiple currencies
- Offering dark/light theme modes

## Tech Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui components
- **Data Visualization**: Recharts
- **State Management**: React Hooks + Context
- **Hosting**: Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finance-tracker.git
cd finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Features

### Core Features
- 📊 Dashboard with financial overview
- 💰 Transaction management
- 📱 Responsive design
- 🌗 Dark/light mode
- 🔒 Secure authentication
- 📈 Visual analytics
- 💵 Multi-currency support

### Budget Management
- Automated 50/30/20 rule calculation
- Monthly budget tracking
- Spending category analysis
- Financial goals setting

## Project Structure

```
finance-tracker/
├── app/                   # Next.js app directory
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   └── settings/         # Settings pages
├── components/           # Reusable components
├── lib/                  # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── public/              # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
