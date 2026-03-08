import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardMaestro } from "@/components/dashboard/DashboardMaestro";
import { DashboardRevisor } from "@/components/dashboard/DashboardRevisor";
import { DashboardCoordinadorMunicipal } from "@/components/dashboard/DashboardCoordinadorMunicipal";
import { DashboardCoordinadorPuesto } from "@/components/dashboard/DashboardCoordinadorPuesto";
import { DashboardTestigo } from "@/components/dashboard/DashboardTestigo";
import type { Profile } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select(
      `
      *,
      municipio:municipio_id (*),
      puesto:puesto_id (*)
    `,
    )
    .eq("id", user.id)
    .single()) as { data: Profile | null };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Perfil no encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Tu usuario existe pero no tiene un perfil configurado en el sistema.
            Contacta al administrador.
          </p>
          <a href="/login" className="text-blue-600 hover:underline">
            Volver a inicio
          </a>
        </div>
      </div>
    );
  }

  // Renderizar dashboard según el rol
  switch (profile.role) {
    case "maestro":
      return <DashboardMaestro profile={profile as Profile} />;
    case "revisor":
      return <DashboardRevisor profile={profile as Profile} />;
    case "coordinador_municipal":
      return <DashboardCoordinadorMunicipal profile={profile as Profile} />;
    case "coordinador_puesto":
      return <DashboardCoordinadorPuesto profile={profile as Profile} />;
    case "testigo":
      return <DashboardTestigo profile={profile as Profile} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Rol inválido
            </h2>
            <p className="text-gray-600 mb-6">
              Tu perfil tiene asignado el rol <strong>{profile.role}</strong>,
              el cual no tiene un panel asignado. Contacta al administrador.
            </p>
            <a href="/login" className="text-blue-600 hover:underline">
              Volver a inicio
            </a>
          </div>
        </div>
      );
  }
}
