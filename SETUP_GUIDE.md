# Setup Guide

## Prerequisites
- Node.js 18+
- Supabase Account
- Google Gemini API Key

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

## Environment Setup
1.  Copy `.env.example` to `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
2.  Fill in the keys.

## Database
1.  Create a Supabase project.
2.  Run the migrations (in `supabase/migrations`) or use the SQL editor to create generated tables.
3.  **Storage**: Create a bucket named `videos` and make it Public.

## Running Locally
```bash
npm run dev
```

## Production Build
```bash
npm run build
npm start
```
