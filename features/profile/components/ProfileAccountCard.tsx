import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMediumDate, roleLabel } from "@/lib/utils";
import type { ProfileData } from "../services/profile.service";

// Tarjeta de información de la cuenta (SPEC-125).
// Presentacional: recibe el DTO preparado por el servicio.
export function ProfileAccountCard({
  profile,
}: {
  profile: Pick<ProfileData, "name" | "email" | "role" | "createdAt" | "provider">;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la cuenta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Nombre:</span> {profile.name}
        </p>
        <p>
          <span className="font-medium">Correo electrónico:</span> {profile.email}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium">Rol:</span>{" "}
          <Badge variant="secondary">{roleLabel(profile.role)}</Badge>
        </p>
        <p>
          <span className="font-medium">Miembro desde:</span> {formatMediumDate(profile.createdAt)}
        </p>
        <p>
          <span className="font-medium">Proveedor:</span> {profile.provider}
        </p>
      </CardContent>
    </Card>
  );
}
