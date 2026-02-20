'use client'

import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/motion-variants'
import { BookOpen, MessageSquare, Award, Zap, Shield, Wand2 } from 'lucide-react'

const features = [
    {
        icon: BookOpen,
        title: 'Interactive Courses',
        description: 'Engaging video lessons, quizzes, and hands-on projects designed by expert instructors.',
        gradient: 'from-primary/20 to-primary/5',
        iconColor: 'text-primary',
        iconBg: 'bg-primary/10',
    },
    {
        icon: Zap,
        title: 'Gamified Learning',
        description: 'Earn XP, maintain streaks, unlock achievements, and compete on leaderboards.',
        gradient: 'from-yellow-500/20 to-yellow-500/5',
        iconColor: 'text-yellow-500',
        iconBg: 'bg-yellow-500/10',
    },
    {
        icon: Award,
        title: 'Verified Certificates',
        description: 'Receive blockchain-verifiable certificates upon course completion to showcase your skills.',
        gradient: 'from-purple-500/20 to-purple-500/5',
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-500/10',
    },
    {
        icon: MessageSquare,
        title: 'Social Learning',
        description: 'Connect with peers, mentors, and instructors through encrypted real-time messaging.',
        gradient: 'from-secondary/20 to-secondary/5',
        iconColor: 'text-secondary',
        iconBg: 'bg-secondary/10',
    },
    {
        icon: Wand2,
        title: 'AI-Powered Assistant',
        description: 'Get instant help from our AI tutor that understands your course material and adapts to you.',
        gradient: 'from-blue-500/20 to-blue-500/5',
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-500/10',
    },
    {
        icon: Shield,
        title: 'Privacy First',
        description: 'End-to-end encryption, hashed IPs, and GDPR-compliant data handling by design.',
        gradient: 'from-green-500/20 to-green-500/5',
        iconColor: 'text-green-500',
        iconBg: 'bg-green-500/10',
    },
]

export function Features() {
    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Subtle background mesh */}
            <div className="absolute inset-0 mesh-gradient opacity-30" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-sm font-semibold text-primary mb-3 tracking-wider uppercase">
                        Why Antigravity?
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-4">
                        Everything you need to <span className="gradient-text">excel</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        A complete learning ecosystem designed to keep you engaged, motivated, and always growing.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            variants={fadeInUp}
                            className={`group relative glass-card rounded-2xl p-8 cursor-default`}
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.iconBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                                </div>

                                <h3 className="text-xl font-bold mb-2 tracking-tight">
                                    {feature.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
