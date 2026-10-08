interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

// Sección del dashboard (SPEC-100). Presentacional.
export function DashboardSection({ title, children }: DashboardSectionProps) {
  return (
    <section aria-label={title} className="space-y-4">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
