"use client";

import { useState, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, Play, Plus } from "lucide-react";
import { createNote, deleteNote } from "@/actions/notes";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm h-full flex flex-col">
            <div className="p-4 border-b font-semibold flex justify-between items-center">
                <span>My Notes</span>
                <span className="text-xs text-muted-foreground">{initialNotes.length} notes</span>
            </div>

            <div className="p-4 border-b bg-muted/20">
                <div className="flex gap-2">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type a note at current time..."
                        className="resize-none min-h-[80px]"
                    />
                </div>
                <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving || !content.trim()}>
                        <Plus className="w-4 h-4 mr-1" />
                        Save at {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"}
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4 h-[400px]">
                <div className="space-y-4">
                    {initialNotes.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            No notes yet. Start watching and typing!
                        </div>
                    )}
                    {initialNotes.map((note) => (
                        <div key={note.id} className="group relative border rounded-md p-3 bg-background hover:bg-accent/5 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs font-mono text-primary bg-primary/10 hover:bg-primary/20"
                                    onClick={() => handleSeek(note.timestamp)}
                                >
                                    <Play className="w-3 h-3 mr-1" />
                                    {formatTime(note.timestamp)}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                                    onClick={() => handleDelete(note.id)}
                                >
                                    <Trash className="w-3 h-3" />
                                </Button>
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{note.content}</p>
                            <div className="text-[10px] text-muted-foreground mt-2 text-right">
                                {new Date(note.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
