'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-3xl animate-pulse" />
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-3xl animate-pulse delay-2000" />
            </div>

            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-xl"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>The Future of Learning is Here</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto"
                    >
                        Learn Without Limits. <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-x">
                            Defy Gravity.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto"
                    >
                        Antigravity is the next-gen platform that combines world-class education with gamified learning. Master new skills, earn achievements, and build your future.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 min-w-[200px]"
                    >
                        <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
                            <Link href="/auth/register">
                                Get Started <Rocket className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent/10 transition-all hover:scale-105" asChild>
                            <Link href="/courses">
                                Explore Courses
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
