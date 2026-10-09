import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

// Tarjeta de estadística compartida (Dashboard, Perfil).
// Puramente visual: icono + número con protagonismo. Sin lógica de dominio.
export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Icon className="size-6" aria-hidden="true" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-6xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
