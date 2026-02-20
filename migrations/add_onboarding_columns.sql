-- ==========================================
-- MIGRATION: Add onboarding profile columns
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. Add missing columns to profiles table for onboarding
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS uid_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date timestamp with time zone;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';

-- 2. Add INSERT/UPDATE policies for daily_activity (needed for onboarding welcome bonus)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own daily activity' AND tablename = 'daily_activity'
  ) THEN
    CREATE POLICY "Users can insert their own daily activity"
      ON public.daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own daily activity' AND tablename = 'daily_activity'
  ) THEN
    CREATE POLICY "Users can update their own daily activity"
      ON public.daily_activity FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;
