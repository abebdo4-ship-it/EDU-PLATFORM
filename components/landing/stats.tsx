'use client'

import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function Stats() {
    // Determine stats (can be dynamic later)
    const stats = [
        { label: "Active Learners", value: "10k+" },
        { label: "Courses Available", value: "500+" },
        { label: "Instructors", value: "150+" },
        { label: "Certificates Issued", value: "5k+" },
    ]

    return (
        <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="space-y-2"
                        >
                            <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{stat.value}</div>
                            <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
