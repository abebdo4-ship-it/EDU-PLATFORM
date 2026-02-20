'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Rocket, Play, GraduationCap, Users, BookOpen, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { staggerContainer, fadeInUp, fadeIn } from '@/lib/motion-variants'
import { useRef, useEffect, useState } from 'react'

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return
        let start = 0
        const duration = 2000
        const step = target / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [isVisible, target])

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Floating geometric shapes for the background
function FloatingShapes() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 mesh-gradient opacity-60" />

            {/* Morphing blob 1 */}
            <motion.div
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full animate-morph opacity-20"
                style={{ background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--purple-rgb), 0.3))' }}
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Morphing blob 2 */}
            <motion.div
                className="absolute top-1/2 -left-32 w-80 h-80 rounded-full animate-morph opacity-15"
                style={{ background: 'linear-gradient(135deg, rgba(var(--secondary-rgb), 0.4), rgba(var(--accent-rgb), 0.3))', animationDelay: '-4s' }}
                animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating geometric shapes */}
            <motion.div
                className="absolute top-[15%] right-[15%] w-16 h-16 rounded-2xl rotate-45 opacity-20"
                style={{ background: 'linear-gradient(135deg, rgb(var(--primary-rgb)), rgb(var(--purple-rgb)))' }}
                animate={{ y: [0, -20, 0], rotate: [45, 65, 45] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                className="absolute bottom-[20%] left-[10%] w-12 h-12 rounded-full opacity-25"
                style={{ background: 'linear-gradient(135deg, rgb(var(--secondary-rgb)), rgb(var(--accent-rgb)))' }}
                animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <motion.div
                className="absolute top-[60%] right-[8%] w-8 h-8 rounded-lg rotate-12 opacity-20"
                style={{ background: 'rgb(var(--accent-rgb))' }}
                animate={{ y: [0, -12, 0], rotate: [12, 30, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            <motion.div
                className="absolute top-[35%] left-[20%] w-6 h-6 rounded-full opacity-30"
                style={{ background: 'rgb(var(--primary-rgb))' }}
                animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />

            {/* Ring shape */}
            <motion.div
                className="absolute bottom-[35%] right-[25%] w-20 h-20 rounded-full border-4 opacity-10"
                style={{ borderColor: 'rgb(var(--purple-rgb))' }}
                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />

            {/* Small dots scattered */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full opacity-20"
                    style={{
                        background: i % 2 === 0 ? 'rgb(var(--primary-rgb))' : 'rgb(var(--secondary-rgb))',
                        top: `${20 + (i * 12)}%`,
                        left: `${10 + (i * 15)}%`,
                    }}
                    animate={{ y: [0, -8, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                />
            ))}
        </div>
    )
}

export function Hero() {
    const containerRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    })
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section ref={containerRef} className="relative overflow-hidden bg-background min-h-screen flex items-center pt-20 pb-16">
            <FloatingShapes />

            <motion.div
                style={{ y: heroY, opacity: heroOpacity }}
                className="container px-4 md:px-6 mx-auto relative z-10"
            >
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center space-y-8"
                >
                    {/* Badge */}
                    <motion.div
                        variants={fadeInUp}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-xl glass hover:bg-primary/10 transition-colors cursor-default"
                    >
                        <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                        <span>The Future of Learning is Here</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl mx-auto leading-[0.9]"
                    >
                        Learn Without Limits.
                        <br className="hidden sm:inline" />
                        <span className="gradient-text">
                            Defy Gravity.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={fadeInUp}
                        className="max-w-[700px] text-muted-foreground text-lg md:text-xl/relaxed lg:text-xl/relaxed mx-auto"
                    >
                        Antigravity is the next-gen platform that combines world-class education
                        with gamified learning. Master new skills, earn achievements, and build your future.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 min-w-[200px]"
                    >
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-100 animate-glow relative overflow-hidden group"
                            asChild
                        >
                            <Link href="/auth/register">
                                <span className="relative z-10 flex items-center">
                                    Get Started <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent/10 transition-all duration-300 hover:scale-105 active:scale-100 glass group"
                            asChild
                        >
                            <Link href="/search">
                                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                Explore Courses
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        variants={fadeInUp}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-12 pt-8 border-t border-border/50 w-full max-w-3xl"
                    >
                        {[
                            { icon: Users, value: 10000, suffix: '+', label: 'Students' },
                            { icon: BookOpen, value: 500, suffix: '+', label: 'Courses' },
                            { icon: Trophy, value: 50000, suffix: '+', label: 'Certificates' },
                            { icon: GraduationCap, value: 200, suffix: '+', label: 'Instructors' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="flex flex-col items-center space-y-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                            >
                                <stat.icon className="h-5 w-5 text-primary mb-1" />
                                <span className="text-2xl md:text-3xl font-bold">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className="text-xs text-muted-foreground">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}
