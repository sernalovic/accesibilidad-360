import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

// Tarjeta de estadística (SPEC-100 + microfase UX).
// Presentacional: icono + número con protagonismo.
export function DashboardStatCard({ label, value, icon: Icon }: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
