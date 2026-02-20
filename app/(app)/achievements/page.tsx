export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { Trophy, Star, Flame, Zap, Award, Target } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Achievements | Antigravity',
    description: 'Your learning achievements and badges',
}

const BADGE_DEFINITIONS = [
    { id: 'first_lesson', name: 'First Step', description: 'Complete your first lesson', icon: Star, color: 'text-yellow-500', xpRequired: 10 },
    { id: 'streak_3', name: '3-Day Streak', description: 'Learn 3 days in a row', icon: Flame, color: 'text-orange-500', xpRequired: 50 },
    { id: 'streak_7', name: 'Week Warrior', description: 'Learn 7 days in a row', icon: Flame, color: 'text-red-500', xpRequired: 150 },
    { id: 'xp_100', name: 'Getting Started', description: 'Earn 100 XP', icon: Zap, color: 'text-blue-500', xpRequired: 100 },
    { id: 'xp_500', name: 'Rising Star', description: 'Earn 500 XP', icon: Zap, color: 'text-purple-500', xpRequired: 500 },
    { id: 'xp_1000', name: 'Knowledge Seeker', description: 'Earn 1,000 XP', icon: Award, color: 'text-indigo-500', xpRequired: 1000 },
    { id: 'xp_5000', name: 'Master Learner', description: 'Earn 5,000 XP', icon: Trophy, color: 'text-amber-500', xpRequired: 5000 },
    { id: 'course_1', name: 'Course Complete', description: 'Complete your first course', icon: Target, color: 'text-green-500', xpRequired: 200 },
]

const LEVELS = [
    { name: 'Beginner', minXP: 0, maxXP: 100 },
    { name: 'Learner', minXP: 100, maxXP: 500 },
    { name: 'Achiever', minXP: 500, maxXP: 1500 },
    { name: 'Expert', minXP: 1500, maxXP: 5000 },
    { name: 'Legend', minXP: 5000, maxXP: Infinity },
]

function getLevel(xp: number) {
    return LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[0]
}

export default async function AchievementsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('xp_points, daily_streak, full_name')
        .eq('id', user.id)
        .single()

    const xp = profile?.xp_points || 0
    const streak = profile?.daily_streak || 0
    const level = getLevel(xp)
    const nextLevel = LEVELS[LEVELS.indexOf(level) + 1]
    const progressToNext = nextLevel
        ? Math.min(((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100, 100)
        : 100

    const unlockedBadges = BADGE_DEFINITIONS.filter(b => xp >= b.xpRequired)
    const lockedBadges = BADGE_DEFINITIONS.filter(b => xp < b.xpRequired)

    return (
        <div className="p-6 space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    Achievements
                </h1>
                <p className="text-muted-foreground text-sm">
                    Track your progress and unlock badges
                </p>
            </div>

            {/* Level & Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="text-3xl font-bold">{level.name}</p>
                    {nextLevel && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{xp} XP</span>
                                <span>{nextLevel.minXP} XP</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${progressToNext}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="rounded-xl border bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-3xl font-bold flex items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-500" />
                        {xp.toLocaleString()}
                    </p>
                </div>
                <div className="rounded-xl border bg-card p-6 space-y-3">
                    <p className="text-sm text-muted-foreground">Daily Streak</p>
                    <p className="text-3xl font-bold flex items-center gap-2">
                        <Flame className="h-6 w-6 text-orange-500" />
                        {streak} day{streak !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Unlocked Badges */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold">
                    Unlocked ({unlockedBadges.length}/{BADGE_DEFINITIONS.length})
                </h2>
                {unlockedBadges.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                        Complete lessons to earn your first badge!
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {unlockedBadges.map((badge) => {
                            const Icon = badge.icon
                            return (
                                <div key={badge.id} className="rounded-xl border bg-card p-4 text-center space-y-2">
                                    <Icon className={`h-10 w-10 mx-auto ${badge.color}`} />
                                    <p className="font-semibold text-sm">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-muted-foreground">Locked</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {lockedBadges.map((badge) => {
                            const Icon = badge.icon
                            return (
                                <div key={badge.id} className="rounded-xl border bg-card p-4 text-center space-y-2 opacity-40">
                                    <Icon className="h-10 w-10 mx-auto text-muted-foreground" />
                                    <p className="font-semibold text-sm">{badge.name}</p>
                                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                                    <p className="text-xs text-muted-foreground">{badge.xpRequired} XP required</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
