'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const supabase = createClient()

async function fetchUserRole(): Promise<{ role: Profile['role'] | null; profile: Profile | null }> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { role: null, profile: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as unknown as Profile | null

  return {
    role: typedProfile?.role || null,
    profile: typedProfile,
  }
}

export function useUserRole() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userRole'],
    queryFn: fetchUserRole,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  return {
    role: data?.role || null,
    profile: data?.profile || null,
    isLoading,
    error,
  }
}
