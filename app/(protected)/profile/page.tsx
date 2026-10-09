import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, Camera, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/stats/StatCard";
import { requireSession } from "@/lib/auth/require-session";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { getProfileData } from "@/features/profile/services/profile.service";
import { ProfileAccountCard } from "@/features/profile/components/ProfileAccountCard";
import { UpdateNameForm } from "@/features/profile/components/UpdateNameForm";
import { ChangePasswordForm } from "@/features/profile/components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Perfil | Accesibilidad 360",
  description: "Gestiona tu perfil de Accesibilidad 360.",
};

// Perfil del usuario autenticado (SPEC-125).
// Solo compone el DTO preparado por el servicio; sin cálculos aquí.
export default async function ProfilePage() {
  const session = await requireSession();
  const profile = await getProfileData(session.user.id);
  if (!profile) {
    notFound();
  }

  return (
    <main id="contenido">
      <Container>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Perfil</h1>
            <p>Gestiona tu cuenta y revisa tu actividad.</p>
          </div>

          <section aria-label="Información de la cuenta">
            <ProfileAccountCard profile={profile} />
          </section>

          <section aria-label="Editar nombre">
            <Card>
              <CardHeader>
                <CardTitle>Editar nombre</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateNameForm defaultName={profile.name} />
              </CardContent>
            </Card>
          </section>

          <section aria-label="Cambiar contraseña">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar contraseña</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.hasPassword ? (
                  <ChangePasswordForm />
                ) : (
                  <p>
                    Tu cuenta depende de un proveedor externo y no tiene contraseña local que
                    cambiar.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <section aria-label="Mi actividad" className="space-y-4">
            <h2 className="text-xl font-semibold">Mi actividad</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Establecimientos creados"
                value={profile.stats.establishments}
                icon={Building2}
              />
              <StatCard label="Valoraciones realizadas" value={profile.stats.reviews} icon={Star} />
              <StatCard label="Fotografías subidas" value={profile.stats.photos} icon={Camera} />
            </div>
          </section>

          <section aria-label="Cerrar sesión">
            <form action={logoutAction}>
              <Button type="submit" variant="outline">
                Cerrar sesión
              </Button>
            </form>
          </section>
        </div>
      </Container>
    </main>
  );
}
