import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardMaestro } from '@/components/dashboard/DashboardMaestro'
import { DashboardRevisor } from '@/components/dashboard/DashboardRevisor'
import { DashboardCoordinadorMunicipal } from '@/components/dashboard/DashboardCoordinadorMunicipal'
import { DashboardCoordinadorPuesto } from '@/components/dashboard/DashboardCoordinadorPuesto'
import { DashboardTestigo } from '@/components/dashboard/DashboardTestigo'
import type { Profile } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      municipio:municipio_id (*),
      puesto:puesto_id (*)
    `)
    .eq('id', user.id)
    .single() as { data: Profile | null }

  if (!profile) {
    redirect('/login')
  }

  // Renderizar dashboard según el rol
  switch (profile.role) {
    case 'maestro':
      return <DashboardMaestro profile={profile as Profile} />
    case 'revisor':
      return <DashboardRevisor profile={profile as Profile} />
    case 'coordinador_municipal':
      return <DashboardCoordinadorMunicipal profile={profile as Profile} />
    case 'coordinador_puesto':
      return <DashboardCoordinadorPuesto profile={profile as Profile} />
    case 'testigo':
      return <DashboardTestigo profile={profile as Profile} />
    default:
      redirect('/login')
  }
}
