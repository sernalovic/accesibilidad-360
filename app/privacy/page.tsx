import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Política de privacidad | Accesibilidad 360",
  description: "Política de privacidad de Accesibilidad 360.",
};

// Política de privacidad (SPEC-135). Describe únicamente lo que la
// aplicación hace realmente. Contenido estático, sin lógica.
export default function PrivacyPage() {
  return (
    <main id="contenido">
      <Container>
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl font-bold">Política de privacidad</h1>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Proyecto académico</h2>
            <p>
              Accesibilidad 360 es una aplicación desarrollada como Trabajo Fin de Máster y no un
              servicio comercial en producción. Cualquier consulta relacionada con el tratamiento de
              datos debe dirigirse al autor del proyecto a través del medio de contacto que figure
              en la documentación del TFM o en el repositorio.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Datos que recogemos</h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>Nombre y correo electrónico de la cuenta.</li>
              <li>Contraseña, almacenada siempre cifrada y nunca en texto plano.</li>
              <li>Valoraciones, comentarios y fotografías que cada persona publica.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Finalidad</h2>
            <p>
              Los datos se utilizan exclusivamente para el funcionamiento de la plataforma:
              identificar a las personas usuarias, mostrar su actividad y publicar la información de
              accesibilidad que comparten con la comunidad.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Autenticación</h2>
            <p>
              La autenticación se gestiona mediante Auth.js, con sesiones que mantienen la
              identificación de la persona usuaria mientras navega por la aplicación.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Fotografías</h2>
            <p>
              Las fotografías se almacenan en Cloudinary. En la base de datos solo se conserva la
              dirección de la imagen y su identificador, imprescindibles para mostrarla y
              gestionarla.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Conservación</h2>
            <p>
              Los datos se conservan mientras la cuenta exista y sean necesarios para la finalidad
              descrita.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Derechos</h2>
            <p>
              Cada persona puede acceder a su información desde su perfil, corregir su nombre y
              eliminar sus propios contenidos. Para cualquier otra solicitud sobre sus datos puede
              dirigirse al autor del proyecto por el medio indicado en el apartado «Proyecto
              académico».
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Cesión de datos</h2>
            <p>Los datos personales no se venden ni se ceden con fines comerciales.</p>
          </section>
        </div>
      </Container>
    </main>
  );
}
