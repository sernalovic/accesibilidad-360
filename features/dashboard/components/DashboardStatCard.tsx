import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatCardProps {
  label: string;
  value: number;
}

// Tarjeta de estadística (SPEC-100). Presentacional.
export function DashboardStatCard({ label, value }: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
