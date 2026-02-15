# Postify - AI Content Assistant

An AI-powered social media content generator built with Next.js and Google Gemini API. Generate captions, hashtags, viral post ideas, hooks, and more — tailored to your content niche.

## Features

- 9 content niches (Fitness, Tech, Fashion, Travel, Education, Business, Gaming, News, Other)
- 2 content modes (Creative / Trending)
- 7 AI-powered tools:
  1. Caption Generator
  2. Hashtag Generator
  3. Viral Post Ideas
  4. Hook Generator
  5. Improve My Caption
  6. Best Posting Time
  7. Trending Topics
- Conversational chat interface
- `/menu` command to return to tools anytime
- `/reset` command to start over

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Google Gemini API (`@google/generative-ai`)
- React Markdown

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher
- A Google Gemini API key

### Step 1: Get a Gemini API Key

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API key"** → **"Create API key in new project"**
4. Copy the generated key

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and replace the placeholder with your actual API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
postify/
├── app/
│   ├── api/chat/route.ts    — Gemini API endpoint
│   ├── page.tsx             — Main chat page
│   ├── layout.tsx           — Root layout
│   └── globals.css          — Global styles & animations
├── components/
│   ├── ChatMessage.tsx      — Chat bubble with markdown rendering
│   ├── ChatInput.tsx        — Text input with send button
│   ├── NicheSelector.tsx    — Niche selection grid
│   ├── ModeSelector.tsx     — Mode selection cards
│   ├── MenuSelector.tsx     — Main menu options
│   └── SuggestionBar.tsx    — Quick action suggestions
├── lib/
│   └── gemini.ts            — Gemini client & prompt templates
├── types/
│   └── index.ts             — TypeScript type definitions
├── .env.example             — Environment variable template
└── .env.local               — Your actual API key (git-ignored)
```

## Important Notes

- **Never commit `.env.local`** — it contains your secret API key and is already listed in `.gitignore`
- The Gemini free tier has daily request limits. If you hit rate limits, wait for the quota to reset or enable billing on your Google Cloud project.
