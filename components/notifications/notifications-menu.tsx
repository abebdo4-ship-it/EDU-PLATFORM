'use client'

import { useState, useTransition } from 'react'
import { Bell, Check, CircleAlert, CheckCircle2, MessageSquare, BookOpen, Clock } from 'lucide-react'
import { markNotificationRead, markAllNotificationsRead } from '@/actions/notifications'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

type Notification = {
    id: string
    is_read: boolean
    title: string
    message: string
    type: string
    created_at: string
}

export function NotificationsMenu({ initialNotifications }: { initialNotifications: Notification[] }) {
    const [notifications, setNotifications] = useState(initialNotifications)
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const unreadCount = notifications.filter(n => !n.is_read).length

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))

        startTransition(async () => {
            await markNotificationRead(id)
        })
    }

    const handleMarkAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))

        startTransition(async () => {
            await markAllNotificationsRead()
        })
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'welcome': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            case 'course_approved': return <Check className="w-4 h-4 text-emerald-500" />
            case 'course_rejected': return <CircleAlert className="w-4 h-4 text-red-500" />
            case 'new_review': return <MessageSquare className="w-4 h-4 text-amber-500" />
            default: return <Bell className="w-4 h-4 text-primary" />
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <div className="relative p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer group">
                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    {unreadCount > 0 && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-in zoom-in" />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden rounded-2xl">
                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                    <DropdownMenuLabel className="p-0 font-semibold text-base">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isPending}
                            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2 space-y-1">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                            <Bell className="w-8 h-8 opacity-20 mb-3" />
                            <p className="text-sm">You have no notifications right now.</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex items-start gap-4 p-3 rounded-xl cursor-default focus:bg-white/5 ${!notification.is_read ? 'bg-primary/5' : ''}`}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <div className="mt-1 shrink-0 bg-background border border-border/50 p-2 rounded-full">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className={`text-sm font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {notification.title}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground/80 shrink-0 flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>
                                {!notification.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="shrink-0 p-1.5 hover:bg-white/10 rounded-full transition-colors mt-2 text-muted-foreground hover:text-foreground"
                                        title="Mark as read"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
