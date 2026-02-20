'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markNotificationRead(notificationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id) // Ensure users only mark their own notifications

    if (error) {
        console.error('Failed to mark notification read:', error)
        return { error: 'Failed' }
    }

    revalidatePath('/', 'layout') // Revalidate layout to pick up new notification count
    return { success: true }
}

export async function markAllNotificationsRead() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

    if (error) {
        console.error('Failed to mark all read:', error)
        return { error: 'Failed' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
