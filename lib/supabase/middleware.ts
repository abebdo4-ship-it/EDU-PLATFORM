import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If env vars are missing, pass through without auth check
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase env vars not set - skipping auth middleware')
        return supabaseResponse
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        // Enforce onboarding
        const isOnboardingRoute = request.nextUrl.pathname.startsWith('/onboarding')

        // Define protected routes that require onboarding
        const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname.startsWith('/courses') ||
            request.nextUrl.pathname.startsWith('/messages') ||
            request.nextUrl.pathname.startsWith('/social')

        if (isProtectedRoute && !isOnboardingRoute) {
            const hasOnboarded = request.cookies.has('onboarding_complete')
            if (!hasOnboarded) {
                const redirectUrl = request.nextUrl.clone()
                redirectUrl.pathname = '/onboarding'
                return NextResponse.redirect(redirectUrl)
            }
        }
    } else {
        // User is NOT logged in
        const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname.startsWith('/courses') ||
            request.nextUrl.pathname.startsWith('/messages') ||
            request.nextUrl.pathname.startsWith('/social') ||
            request.nextUrl.pathname.startsWith('/onboarding') ||
            request.nextUrl.pathname.startsWith('/instructor')

        if (isProtectedRoute) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/auth/login'
            return NextResponse.redirect(redirectUrl)
        }
    }

    return supabaseResponse
}
