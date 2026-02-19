"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format"; // Need to create this utility or inline it


interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string;
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
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full bg-white dark:bg-slate-950">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            <BookOpen className="h-10 w-10 text-slate-400" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <div className="mt-auto">
                            <div className="h-1 w-full bg-sky-100 rounded-full overflow-hidden">
                                <div className="h-full bg-sky-700" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {Math.round(progress)}% Complete
                            </p>
                        </div>
                    ) : (
                        <p className="text-md md:text-sm font-medium text-slate-700 dark:text-slate-200 mt-auto">
                            {price === 0 ? "Free" : formatPrice(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
