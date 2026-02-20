'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Settings, User, Bell, Palette, Shield, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
    const supabase = createClient()
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [fullName, setFullName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [experienceLevel, setExperienceLevel] = useState('')

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/auth/login')
                return
            }

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setProfile(data)
                setFullName(data.full_name || '')
                setDisplayName(data.display_name || '')
                setExperienceLevel(data.experience_level || '')
            }
            setLoading(false)
        }
        loadProfile()
    }, [router])

    const handleSave = async () => {
        setSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    display_name: displayName,
                    experience_level: experienceLevel,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error
            toast.success('Settings saved!')
        } catch (error) {
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const handleBillingPortal = async () => {
        try {
            const res = await fetch('/api/checkout/portal', {
                method: 'POST',
            })
            if (!res.ok) throw new Error('Failed to generate portal link')
            const { url } = await res.json()
            window.location.href = url
        } catch (error) {
            toast.error('Could not open billing portal')
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-8 max-w-2xl">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Settings
                </h1>
                <p className="text-muted-foreground text-sm">
                    Manage your account and preferences
                </p>
            </div>

            {/* Profile Settings */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile
                </h2>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Experience Level</label>
                        <select
                            value={experienceLevel}
                            onChange={(e) => setExperienceLevel(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <span className="text-sm text-muted-foreground">UID:</span>
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                            {profile?.uid_code || 'N/A'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Account Info */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account
                </h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Role</span>
                        <span className="capitalize font-medium">{profile?.role || 'student'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="font-medium">
                            {profile?.created_at
                                ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                                : 'N/A'
                            }
                        </span>
                    </div>
                </div>

                {profile?.is_pro && (
                    <div className="pt-4">
                        <button
                            onClick={handleBillingPortal}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Manage Pro Subscription
                        </button>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-destructive/20 bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
