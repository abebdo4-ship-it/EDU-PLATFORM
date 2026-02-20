"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { FavoriteButton } from "@/components/course/favorite-button";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/motion-variants";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string;
};

// Map categories to specific gradient glow colors
const getCategoryColor = (category: string) => {
    const defaultColor = "from-primary/20 to-secondary/20";
    const colors: Record<string, string> = {
        "Technology": "from-cyan-500/20 to-blue-500/20",
        "Business": "from-amber-500/20 to-orange-500/20",
        "Design": "from-pink-500/20 to-rose-500/20",
        "Science": "from-emerald-500/20 to-teal-500/20",
        "Mathematics": "from-indigo-500/20 to-violet-500/20",
    };
    return colors[category] || defaultColor;
};

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category
}: CourseCardProps) => {
    const categoryGradient = getCategoryColor(category);

    return (
        <Link href={`/courses/${id}`}>
            <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="group relative h-full"
            >
                {/* Ambient glow behind card */}
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${categoryGradient} blur-lg opacity-0 group-hover:opacity-100 transition duration-500`} />

                <div className="relative glass-card rounded-2xl p-3 h-full overflow-hidden flex flex-col">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
                        <div className="absolute top-2 right-2 z-10">
                            <FavoriteButton courseId={id} />
                        </div>
                        {/* Category Pill Over Image */}
                        <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white tracking-wide uppercase">
                            {category}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-0" />

                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
                                <BookOpen className="h-10 w-10 text-slate-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col flex-1 px-1">
                        <div className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {title}
                        </div>

                        <div className="mt-auto pt-2 flex items-center gap-x-2 text-sm">
                            <div className="flex items-center gap-x-1.5 text-muted-foreground bg-secondary/20 px-2 py-1 rounded-md">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span>
                                    {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/50">
                            {progress !== null ? (
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <p className="text-xs font-medium text-muted-foreground tracking-wide">PROGRESS</p>
                                        <p className="text-xs font-bold text-primary">{Math.round(progress)}%</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-lg font-bold text-foreground">
                                    {price === 0 ? "Free" : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
