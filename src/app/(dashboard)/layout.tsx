"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Cliente estable: se crea una sola vez y se reutiliza en todos los renders
  const supabase = useMemo(() => createClient(), []);

  // Cargar perfil del usuario al montar
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.warn("Error temporal obteniendo sesión:", error.message);
        setIsLoading(false);
        return;
      }

      if (!user) {
        console.warn(
          "Cliente: No se encontró sesión (quizás por hora desfasada). Confiando en cookies del servidor.",
        );
        setIsLoading(false);
        return;
      }

      const { data: profileData } = (await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()) as { data: Profile | null };

      setProfile(profileData);
      setIsLoading(false);
    }

    loadUser();
  }, [supabase, router]);

  // Listener para renovación automática del token y detección de sign-out
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // El logout lo maneja Header.tsx con window.location.href
      // No forzamos un push al /login aquí en eventos de cliente
      // porque puede causar cierres de sesión "falsos" por desincronización de hora del PC
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Overlay para cerrar sidebar en mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 nav:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Sidebar
          profile={profile}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            profile={profile}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          <main className="flex-1 overflow-auto p-4 nav:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
