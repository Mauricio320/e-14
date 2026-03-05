import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MesaPageClient } from './MesaPageClient'

interface MesaPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MesaPage({ params }: MesaPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <MesaPageClient mesaId={id} />
}
