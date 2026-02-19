'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

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
                    'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                    !selectedId
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-input text-muted-foreground'
                )}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => handleClick(cat.id)}
                    className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                        selectedId === cat.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-input text-muted-foreground'
                    )}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    )
}
