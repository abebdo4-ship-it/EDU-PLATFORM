import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase env vars missing in server component - returning null client')
        // Return a dummy client that throws or logs on usage, or just null?
        // Returning null might break components expecting a client.
        // Better to return a client that logs errors on specific method calls if possible,
        // or just let it crash later with a clearer message?
        // Actually, createServerClient throws if arguments are missing.
        // Let's return a safe mock or throw a clear error.
        // But for /search page, maybe we want it to render *without* content if Supabase is missing?
        // No, best is to throw a clear error so Vercel logs show it.
        // But to avoid 500 to user, we can wrap the creation in try/catch in the page?
        // No, createClient is used everywhere.
        // Let's just return a "safe" empty client if possible, or allow it to fail but logged.

        // Actually, just let it fail but maybe log *why* first.
        // Or better: Use empty strings to prevent crash, but operations will fail.
        return createServerClient(
            supabaseUrl || '',
            supabaseAnonKey || '',
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
