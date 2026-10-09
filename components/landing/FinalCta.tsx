import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Llamada final a participar (solo presentación).
export function FinalCta() {
  return (
    <section aria-label="Participa en la comunidad">
      <Card>
        <CardHeader>
          <CardTitle>Ayuda a otras personas con tu experiencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Crea una cuenta gratuita para valorar establecimientos, subir fotografías y compartir
            comentarios. Cuantas más experiencias, más útil es la información para todos.
          </p>
          <Link href="/register" className={buttonVariants()}>
            Crear cuenta
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
