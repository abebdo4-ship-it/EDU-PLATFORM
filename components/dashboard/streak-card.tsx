'use client'

import { useUserProfile } from "@/hooks/use-user-profile"
import { Flame, Star, BookCheck, Target } from "lucide-react"
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/motion-variants'
import { useEffect, useState, useRef } from 'react'

function AnimatedNumber({ value }: { value: number }) {
    const [current, setCurrent] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true) },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!started) return
        let start = 0
        const duration = 1500
        const step = value / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= value) { setCurrent(value); clearInterval(timer) }
            else setCurrent(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [started, value])

    return <span ref={ref}>{current.toLocaleString()}</span>
}

const XP_PER_LEVEL = 500

export function StreakCard() {
    const { data: user } = useUserProfile()

    const xp = user?.xp_points || 0
    const level = Math.floor(xp / XP_PER_LEVEL) + 1
    const xpInLevel = xp % XP_PER_LEVEL
    const progress = (xpInLevel / XP_PER_LEVEL) * 100

    const stats = [
        {
            icon: Flame,
            label: 'Daily Streak',
            value: user?.daily_streak || 0,
            suffix: ' Days',
            description: '+10% XP Bonus',
            gradient: 'from-orange-500/15 to-red-500/5',
            iconColor: 'text-orange-500',
            iconGlow: 'shadow-orange-500/30',
        },
        {
            icon: Star,
            label: 'Total XP',
            value: xp,
            suffix: ' XP',
            description: `Level ${level}`,
            gradient: 'from-yellow-500/15 to-amber-500/5',
            iconColor: 'text-yellow-500',
            iconGlow: 'shadow-yellow-500/30',
            showProgress: true,
        },
        {
            icon: BookCheck,
            label: 'Courses',
            value: 0,
            suffix: '',
            description: 'Enrolled',
            gradient: 'from-blue-500/15 to-cyan-500/5',
            iconColor: 'text-blue-500',
            iconGlow: 'shadow-blue-500/30',
        },
        {
            icon: Target,
            label: 'Rank',
            value: 0,
            suffix: '',
            description: user?.experience_level || 'Beginner',
            gradient: 'from-purple-500/15 to-violet-500/5',
            iconColor: 'text-purple-500',
            iconGlow: 'shadow-purple-500/30',
            isText: true,
            textValue: user?.experience_level || 'Beginner',
        },
    ]

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
            {stats.map((stat) => (
                <motion.div
                    key={stat.label}
                    variants={fadeInUp}
                    className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${stat.gradient} group cursor-default overflow-hidden relative`}
                >
                    {/* Glow effect */}
                    <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${stat.iconColor} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                            <div className={`p-2 rounded-xl bg-white/50 dark:bg-white/5 shadow-lg ${stat.iconGlow}`}>
                                <stat.icon className={`h-4 w-4 ${stat.iconColor} ${stat.label === 'Daily Streak' ? 'animate-pulse' : ''}`} />
                            </div>
                        </div>

                        <div className="text-2xl font-bold tracking-tight mb-1">
                            {stat.isText ? stat.textValue : (
                                <>
                                    <AnimatedNumber value={stat.value} />
                                    {stat.suffix}
                                </>
                            )}
                        </div>

                        {stat.showProgress ? (
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">{xpInLevel}/{XP_PER_LEVEL} XP to Level {level + 1}</p>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}
