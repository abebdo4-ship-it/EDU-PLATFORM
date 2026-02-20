'use client'

import { useUserProfile } from "@/hooks/use-user-profile"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion-variants'
import { Sun, Moon, CloudSun, Sparkles } from 'lucide-react'

export function DashboardHeader() {
    const { data: user, isLoading } = useUserProfile()

    if (isLoading) {
        return (
            <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-5">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-[280px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        )
    }

    const hour = new Date().getHours()
    const getGreeting = () => {
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }
    const getIcon = () => {
        if (hour < 12) return Sun
        if (hour < 18) return CloudSun
        return Moon
    }
    const getGradient = () => {
        if (hour < 12) return 'from-amber-500/20 via-orange-500/10 to-yellow-500/5'
        if (hour < 18) return 'from-blue-500/20 via-sky-500/10 to-cyan-500/5'
        return 'from-indigo-500/20 via-purple-500/10 to-blue-500/5'
    }

    const TimeIcon = getIcon()
    const displayName = user?.display_name || user?.full_name?.split(' ')[0] || 'Student'

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                variants={fadeInUp}
                className={`relative overflow-hidden glass-card rounded-2xl p-8 bg-gradient-to-r ${getGradient()}`}
            >
                {/* Background decorations */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 animate-morph blur-xl" />
                <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-gradient-to-br from-secondary/10 to-accent/5 animate-float-slow blur-lg" />

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <TimeIcon className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {getGreeting()}, {displayName}! 👋
                            </h2>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                Ready to continue your learning journey?
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
