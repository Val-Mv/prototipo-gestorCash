import { useEffect, useMemo, useState } from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { obtenerReportesDiarios, type ReporteDiario } from '@/lib/api/reports';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AnomaliaItem {
  titulo: string;
  detalle: string;
  fecha: string;
  severidad: 'low' | 'medium' | 'high';
}

export function AnomalyFeed() {
  const { toast } = useToast();
  const [reportes, setReportes] = useState<ReporteDiario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setLoading(true);
        const data = await obtenerReportesDiarios({ limit: 14 });
        setReportes(data);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar el feed de anomalías',
          description: error?.message ?? 'Intenta nuevamente en unos minutos.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [toast]);

  const anomalies = useMemo<AnomaliaItem[]>(() => {
    return reportes
      .flatMap((reporte) => {
        const anomaliesReporte: AnomaliaItem[] = [];
        const totalVentas = Number(reporte.totalVentas) || 0;
        const totalGastos = Number(reporte.totalGastosDia) || 0;
        const totalDiferencias = Number(reporte.totalDiferencias) || 0;

        if (Math.abs(totalDiferencias) >= 50) {
          anomaliesReporte.push({
            titulo: 'Diferencia significativa de caja',
            detalle: `Se registró una diferencia de ${totalDiferencias.toFixed(2)} USD.`,
            fecha: reporte.fecha,
            severidad: 'high',
          });
        } else if (Math.abs(totalDiferencias) >= 20) {
          anomaliesReporte.push({
            titulo: 'Diferencia moderada',
            detalle: `La diferencia de caja fue de ${totalDiferencias.toFixed(2)} USD.`,
            fecha: reporte.fecha,
            severidad: 'medium',
          });
        }

        if (totalVentas > 0 && totalGastos > totalVentas * 0.5) {
          anomaliesReporte.push({
            titulo: 'Gastos elevados',
            detalle: 'Los gastos superaron el 50% de las ventas totales.',
            fecha: reporte.fecha,
            severidad: 'medium',
          });
        }

        return anomaliesReporte;
      })
      .slice(0, 5);
  }, [reportes]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            Feed de Anomalías
          </CardTitle>
          <CardDescription>Problemas potenciales detectados recientemente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary"/>
            Feed de Anomalías
        </CardTitle>
        <CardDescription>Problemas potenciales detectados recientemente por IA.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
        {anomalies.length > 0 ? (
          <div className="space-y-4">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium">{anomaly.titulo}</p>
                  <p className="text-sm text-muted-foreground">{anomaly.detalle}</p>
                   <p className="text-xs text-muted-foreground">
                    {new Date(anomaly.fecha).toLocaleDateString('es-PE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
             <Info className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No se Encontraron Anomalías</p>
            <p className="text-xs text-muted-foreground">El sistema no ha detectado ningún problema recientemente.</p>
          </div>
        )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
