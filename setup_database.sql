-- ==========================================
-- PHASE 8 & SOCIAL FEATURES DATABASE SETUP
-- ==========================================

-- 1. Create Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  course_id uuid REFERENCES public.courses NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- 2. Create Daily Activity Table (XP & Streaks)
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL DEFAULT current_date,
  lessons_completed integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own daily activity" ON public.daily_activity FOR SELECT USING (auth.uid() = user_id);

-- 3. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  action text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Add XP and Streak columns to Profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp_points integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_streak integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_active timestamp with time zone;

-- 5. Helper Function: record_lesson_completion (Handles XP and Streaks logic natively)
CREATE OR REPLACE FUNCTION record_lesson_completion(p_user uuid, p_lesson uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_xp_reward CONSTANT integer := 10;
    v_last_active timestamp with time zone;
    v_current_streak integer;
    v_today date := current_date;
    v_yesterday date := current_date - interval '1 day';
BEGIN
    -- A) Mark lesson as completed
    INSERT INTO public.lesson_progress (user_id, lesson_id, completed, completed_at)
    VALUES (p_user, p_lesson, true, now())
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = now();

    -- B) Update daily activity tracking
    INSERT INTO public.daily_activity (user_id, activity_date, lessons_completed, xp_earned)
    VALUES (p_user, v_today, 1, v_xp_reward)
    ON CONFLICT (user_id, activity_date) DO UPDATE 
    SET lessons_completed = public.daily_activity.lessons_completed + 1,
        xp_earned = public.daily_activity.xp_earned + v_xp_reward;

    -- C) Fetch current user stats
    SELECT last_active, daily_streak INTO v_last_active, v_current_streak
    FROM public.profiles
    WHERE id = p_user;

    -- D) Manage streak logic
    IF v_last_active IS NULL OR date_trunc('day', v_last_active) < v_yesterday THEN
        v_current_streak := 1; -- Reset or start a fresh streak
    ELSIF date_trunc('day', v_last_active) = v_yesterday THEN
        v_current_streak := coalesce(v_current_streak, 0) + 1; -- Increment if they were active yesterday
    END IF;
    -- Note: If they already played today, streak stays the same.

    -- E) Save to Profile
    UPDATE public.profiles
    SET xp_points = COALESCE(xp_points, 0) + v_xp_reward,
        daily_streak = v_current_streak,
        last_active = now(),
        updated_at = now()
    WHERE id = p_user;

END;
$$;
