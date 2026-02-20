'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useCallback, useTransition } from 'react'

export function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const params = new URLSearchParams(searchParams.toString())
            if (e.target.value) {
                params.set('title', e.target.value)
            } else {
                params.delete('title')
            }
            startTransition(() => {
                router.replace(`/search?${params.toString()}`)
            })
        },
        [router, searchParams]
    )

    const handleClear = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('title')
        router.replace(`/search?${params.toString()}`)
    }

    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500" />

            <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    className="w-full pl-11 pr-10 py-2.5 rounded-full bg-background/50 backdrop-blur-md border border-border/50 focus:border-primary/50 outline-none text-sm placeholder:text-muted-foreground transition-all shadow-sm"
                    placeholder="Search courses..."
                    defaultValue={searchParams.get('title') ?? ''}
                    onChange={handleSearch}
                />
                {searchParams.get('title') && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    )
}
