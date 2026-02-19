import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface FavoritesStore {
    favorites: string[]; // course_id[]
    isLoaded: boolean;
    fetchFavorites: () => Promise<void>;
    toggleFavorite: (courseId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
    favorites: [],
    isLoaded: false,
    fetchFavorites: async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('favorites')
            .select('course_id')
            .eq('user_id', user.id);

        set({ favorites: data?.map(f => f.course_id) ?? [], isLoaded: true });
    },
    toggleFavorite: async (courseId) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isFav = get().favorites.includes(courseId);
        if (isFav) {
            await supabase.from('favorites').delete()
                .eq('user_id', user.id)
                .eq('course_id', courseId);
            set(s => ({ favorites: s.favorites.filter(id => id !== courseId) }));
        } else {
            await supabase.from('favorites').insert({ user_id: user.id, course_id: courseId });
            set(s => ({ favorites: [...s.favorites, courseId] }));
        }
    }
}));
