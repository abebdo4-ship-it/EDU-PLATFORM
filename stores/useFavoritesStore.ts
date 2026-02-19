import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface FavoritesStore {
    favorites: string[] // course_id[]
    isLoaded: boolean
    fetchFavorites: () => Promise<void>
    toggleFavorite: (courseId: string) => Promise<void>
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
    favorites: [],
    isLoaded: false,
    fetchFavorites: async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            set({ isLoaded: true, favorites: [] })
            return
        }

        const { data } = await supabase
            .from('favorites')
            .select('course_id')
            .eq('user_id', user.id)

        set({ favorites: data?.map(f => f.course_id) ?? [], isLoaded: true })
    },
    toggleFavorite: async (courseId) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const isFav = get().favorites.includes(courseId)

        // Optimistic update
        set(s => ({
            favorites: isFav
                ? s.favorites.filter(id => id !== courseId)
                : [...s.favorites, courseId]
        }))

        if (isFav) {
            await supabase
                .from('favorites')
                .delete()
                .match({ course_id: courseId, user_id: user.id })
        } else {
            await supabase
                .from('favorites')
                .insert({ course_id: courseId, user_id: user.id })
        }
    }
}))
