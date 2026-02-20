'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CategoryFilterProps {
    categories: { id: string; name: string }[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedId = searchParams.get('categoryId')

    const handleClick = (id: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (id) {
            params.set('categoryId', id)
        } else {
            params.delete('categoryId')
        }
        router.replace(`/search?${params.toString()}`)
    }

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => handleClick(null)}
                className={cn(
                    'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden',
                    !selectedId
                        ? 'text-white shadow-md'
                        : 'bg-background/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-muted/80'
                )}
            >
                {!selectedId && (
                    <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
                <span className="relative z-10">All Categories</span>
            </button>

            {categories.map((cat) => {
                const isSelected = selectedId === cat.id;

                return (
                    <button
                        key={cat.id}
                        onClick={() => handleClick(cat.id)}
                        className={cn(
                            'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden',
                            isSelected
                                ? 'text-white shadow-md'
                                : 'bg-background/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:bg-muted/80'
                        )}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{cat.name}</span>
                    </button>
                )
            })}
        </div>
    )
}
