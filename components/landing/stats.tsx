'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!isInView) return
        let start = 0
        const duration = 2200
        const step = value / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= value) { setCurrent(value); clearInterval(timer) }
            else setCurrent(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [isInView, value])

    return <span ref={ref}>{current.toLocaleString()}{suffix}</span>
}

const stats = [
    { value: 98, suffix: '%', label: 'Completion Rate', description: 'Students who finish their courses' },
    { value: 4.9, suffix: '/5', label: 'Average Rating', description: 'From 50,000+ reviews' },
    { value: 150, suffix: '+', label: 'Countries', description: 'Learners from across the globe' },
    { value: 24, suffix: '/7', label: 'Support', description: 'AI-powered help anytime, anywhere' },
]

export function Stats() {
    return (
        <section className="relative py-20 md:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-3">
                        Trusted by learners <span className="gradient-text">worldwide</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Our numbers speak for the quality of education we deliver.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12, duration: 0.5 }}
                            className="glass-card rounded-2xl p-6 text-center"
                        >
                            <div className="text-4xl md:text-5xl font-extrabold mb-1 gradient-text">
                                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="font-semibold text-sm mb-1">{stat.label}</div>
                            <div className="text-xs text-muted-foreground">{stat.description}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
