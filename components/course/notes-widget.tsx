"use client";

import { useState, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, Play, Plus, BookOpen } from "lucide-react";
import { createNote, deleteNote } from "@/actions/notes";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
    id: string;
    content: string;
    timestamp: number;
    created_at: string;
}

interface NotesWidgetProps {
    lessonId: string;
    initialNotes: Note[];
    videoRef: RefObject<HTMLVideoElement | null>;
}

export const NotesWidget = ({ lessonId, initialNotes, videoRef }: NotesWidgetProps) => {
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        if (!content.trim()) return;

        try {
            setIsSaving(true);
            const currentTime = videoRef.current?.currentTime || 0;

            await createNote(lessonId, content, currentTime);
            toast.success("Note saved");
            setContent("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to save note");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (noteId: string) => {
        try {
            await deleteNote(noteId);
            toast.success("Note deleted");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const handleSeek = (timestamp: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = timestamp;
            videoRef.current.play();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass-card rounded-2xl h-[600px] flex flex-col overflow-hidden border border-border/50 shadow-xl relative group">
            {/* Ambient Background Hint */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-colors duration-700" />

            <div className="p-5 border-b border-border/50 flex justify-between items-center bg-background/30 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">My Notes</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-semibold">
                    {initialNotes.length}
                </span>
            </div>

            <div className="p-4 border-b border-border/50 bg-muted/10 backdrop-blur-sm relative z-10">
                <div className="relative group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-500 rounded-xl blur opacity-0 group-focus-within/input:opacity-50 transition duration-500" />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type a note here..."
                        className="relative w-full resize-none min-h-[100px] p-3 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 focus:border-primary/50 outline-none text-sm placeholder:text-muted-foreground transition-all shadow-sm"
                    />
                </div>
                <div className="flex justify-end mt-3">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving || !content.trim()}
                        className="rounded-lg shadow-md hover:scale-105 transition-transform bg-primary"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Save @ {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"}
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4 relative z-10">
                <div className="space-y-4">
                    {initialNotes.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <BookOpen className="w-8 h-8 opacity-20 mb-3" />
                            <p className="text-sm font-medium">No notes yet.</p>
                            <p className="text-xs mt-1">Start watching and typing!</p>
                        </div>
                    )}
                    <AnimatePresence>
                        {initialNotes.map((note) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group/note relative p-4 rounded-xl glass border border-transparent hover:border-border/60 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2.5 text-xs font-bold text-primary border-primary/20 bg-primary/10 hover:bg-primary hover:text-white transition-colors rounded-full"
                                        onClick={() => handleSeek(note.timestamp)}
                                    >
                                        <Play className="w-3 h-3 mr-1" fill="currentColor" />
                                        {formatTime(note.timestamp)}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover/note:opacity-100 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-all rounded-full"
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <p className="text-[14px] text-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                                <div className="text-[10px] font-medium text-muted-foreground/60 mt-3 text-right">
                                    {new Date(note.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </ScrollArea>
        </div>
    );
};
