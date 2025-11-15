import { Suspense, lazy, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { obtenerReportesDiarios } from '@/lib/api/reports';
import { useToast } from '@/hooks/use-toast';

const SalesChartContent = lazy(() => import('./sales-chart-content'));

export function SalesChart() {
  const { toast } = useToast();
  const [chartData, setChartData] = useState<Array<{ date: string; cash: number; card: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reportes = await obtenerReportesDiarios({ limit: 7 });
        const normalized = reportes
          .slice()
          .reverse()
          .map((reporte) => ({
            date: new Date(reporte.fecha).toLocaleDateString('es-PE', {
              month: 'short',
              day: 'numeric',
            }),
            cash: Number(reporte.totalEfectivo) || 0,
            card: Number(reporte.totalTarjeta) || 0,
          }));
        setChartData(normalized);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar el gráfico de ventas',
          description: error?.message ?? 'Intenta nuevamente más tarde.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Ventas Semanales</CardTitle>
        <CardDescription>Ventas en efectivo vs. tarjeta en los últimos 7 días.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <SalesChartContent data={chartData} />
          )}
        </Suspense>
      </CardContent>
    </Card>
  );
}
