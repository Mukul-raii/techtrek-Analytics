# TechPulse Analytics - Frontend

Modern, clean frontend application built with React, TypeScript, Tailwind CSS, and shadcn/ui components following a paperback design aesthetic.

## 🎨 Design System

The frontend follows a **paperback design aesthetic** with:
- Neutral color palette (grays, whites)
- Consistent 8px spacing grid
- Subtle shadows and borders
- Clean, readable typography
- Minimal, focused UI

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Fetch API

## 📁 Project Structure

```
src/
├── api/              # API client configuration
├── components/       # React components
│   ├── common/       # Reusable components
│   ├── layout/       # Layout components
│   ├── trending/     # Trending components
│   ├── analytics/    # Analytics components
│   ├── search/       # Search components
│   └── ui/           # shadcn/ui components
├── constants/        # Design system constants
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # Business logic layer
├── store/            # Zustand state management
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

## 🎯 Architecture Principles

- **Separation of Concerns**: Logic separated into services
- **Controller Pattern**: Services handle business logic
- **Composition**: Small, reusable components

Built with ❤️ for TechPulse Analytics
