# Deployment Guide

Since I cannot directly access your GitHub or Vercel account, please follow these steps to deploy the application.

## 1. Push Code to GitHub

I have initialized the local Git repository and committed all changes. Now you need to push it to a new GitHub repository.

1.  Create a new repository on GitHub (e.g., `antigravity-lms`).
2.  Run the following commands in your terminal (replace `YOUR_USERNAME` and `REPO_NAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the GitHub repository you just created (`antigravity-lms`).
4.  In the **Configure Project** screen:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Environment Variables**:
        *   Open the file `VERCEL_ENV_VARS.txt` I created in the project root.
        *   Copy the variables.
        *   Paste them into the Vercel fields.
        *   **CRITICAL**: Update the values to your REAL API keys. The ones in the file are placeholders.
5.  Click **"Deploy"**.

## 3. Post-Deployment

1.  Once deployed, Vercel will give you a domain (e.g., `antigravity-lms.vercel.app`).
2.  Go to your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**.
3.  Add your Vercel URL to **Site URL** and **Redirect URLs** (e.g., `https://antigravity-lms.vercel.app/auth/callback`).
4.  Update your `NEXT_PUBLIC_APP_URL` environment variable in Vercel to match this new domain.
