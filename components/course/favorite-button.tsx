"use client";

import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
    courseId: string;
}

export const FavoriteButton = ({ courseId }: FavoriteButtonProps) => {
    const { favorites, toggleFavorite, isLoaded } = useFavoritesStore();

    if (!isLoaded) return null;

    const isFavorite = favorites.includes(courseId);

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to course page
        e.stopPropagation();
        toggleFavorite(courseId);
    };

    return (
        <button
            onClick={onClick}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all group/favorites"
        >
            <Heart
                className={cn(
                    "w-5 h-5 transition-colors",
                    isFavorite ? "fill-rose-500 text-rose-500" : "text-white group-hover/favorites:text-rose-400"
                )}
            />
        </button>
    );
};
