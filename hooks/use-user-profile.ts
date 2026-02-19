import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useUserProfile() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error
            return data
        },
    })
}
