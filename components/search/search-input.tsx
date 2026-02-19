'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
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
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                className="pl-9 pr-9"
                placeholder="Search courses..."
                defaultValue={searchParams.get('title') ?? ''}
                onChange={handleSearch}
            />
            {searchParams.get('title') && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
