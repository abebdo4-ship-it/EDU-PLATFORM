'use client'

import { motion } from 'framer-motion'
import { Zap, Trophy, Globe, Users, Shield, Smartphone } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const FEATURES = [
    {
        icon: Zap,
        title: "Interactive Learning",
        description: "Engage with real-time quizzes, coding challenges, and dynamic content that adapts to your pace.",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
    },
    {
        icon: Trophy,
        title: "Gamified Progress",
        description: "Earn XP, unlock badges, and climb the leaderboards. Learning has never been this addictive.",
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        icon: Globe,
        title: "World-Class Instructors",
        description: "Learn from industry experts and thought leaders who are shaping the future of tech.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Users,
        title: "Community First",
        description: "Join a vibrant community of learners. Connect, collaborate, and grow together.",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        icon: Shield,
        title: "Verifiable Certificates",
        description: "Get certified with blockchain-verified credentials that employers trust.",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        icon: Smartphone,
        title: "Learn Anywhere",
        description: "Seamless experience across all devices. Download lessons for offline access.",
        color: "text-secondary",
        bg: "bg-secondary/10",
    },
]

export function Features() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Why Choose Antigravity?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We're not just another course platform. We're a complete ecosystem designed for your success.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow bg-background/50 backdrop-blur-sm group cursor-pointer hover:-translate-y-1 duration-300">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
