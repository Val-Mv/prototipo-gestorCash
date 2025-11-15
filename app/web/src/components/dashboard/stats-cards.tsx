import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { obtenerReportesDiarios, type ReporteDiario } from '@/lib/api/reports';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(amount);

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export function StatsCards() {
  const { toast } = useToast();
  const [reportes, setReportes] = useState<ReporteDiario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setLoading(true);
        const data = await obtenerReportesDiarios({ limit: 7 });
        setReportes(data);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'No se pudo cargar el resumen diario',
          description: error?.message ?? 'Intenta nuevamente en unos minutos.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReportes();
  }, [toast]);

  const stats = useMemo(() => {
    const today = reportes[0];
    const yesterday = reportes[1];

    if (!today) {
      return [
        {
          title: 'Ventas Totales',
          value: formatCurrency(0),
          description: 'Sin datos disponibles',
          icon: DollarSign,
          change: undefined as string | undefined,
          isPositive: true,
        },
        {
          title: 'Conteo de Clientes',
          value: '0',
          description: 'Sin datos disponibles',
          icon: Users,
          change: undefined,
          isPositive: true,
        },
        {
          title: 'Gastos Totales',
          value: formatCurrency(0),
          description: 'Sin datos disponibles',
          icon: TrendingDown,
          change: undefined,
          isPositive: false,
        },
        {
          title: 'Sobrante / Faltante',
          value: formatCurrency(0),
          description: 'Sin datos disponibles',
          icon: TrendingUp,
          change: undefined,
          isPositive: true,
        },
      ];
    }

    const ventasHoy = toNumber(today.totalVentas);
    const efectivoHoy = toNumber(today.totalEfectivo);
    const tarjetaHoy = toNumber(today.totalTarjeta);
    const totalClientesHoy = toNumber(today.totalClientes);
    const gastosHoy = toNumber(today.totalGastosDia);
    const difHoy = toNumber(today.totalDiferencias);

    const ventasAyer = yesterday ? toNumber(yesterday.totalVentas) : ventasHoy;
    const clientesAyer = yesterday ? toNumber(yesterday.totalClientes) : totalClientesHoy;

    const ventasChange = ventasHoy - ventasAyer;
    const ventasPct = ventasAyer === 0 ? 0 : (ventasChange / ventasAyer) * 100;

    const clientesChange = totalClientesHoy - clientesAyer;
    const clientesPct = clientesAyer === 0 ? 0 : (clientesChange / clientesAyer) * 100;

    return [
      {
        title: 'Ventas Totales',
        value: formatCurrency(ventasHoy || efectivoHoy + tarjetaHoy),
        change: `${ventasChange >= 0 ? '+' : ''}${ventasPct.toFixed(1)}%`,
        description: 'vs. día anterior',
        icon: DollarSign,
        isPositive: ventasChange >= 0,
      },
      {
        title: 'Conteo de Clientes',
        value: totalClientesHoy.toString(),
        change: `${clientesChange >= 0 ? '+' : ''}${clientesPct.toFixed(1)}%`,
        description: 'vs. día anterior',
        icon: Users,
        isPositive: clientesChange >= 0,
      },
      {
        title: 'Gastos Totales',
        value: formatCurrency(gastosHoy),
        description: 'acumulado del día',
        icon: TrendingDown,
        change: undefined,
        isPositive: false,
      },
      {
        title: 'Sobrante / Faltante',
        value: formatCurrency(difHoy),
        description: 'acumulado del día',
        icon: difHoy >= 0 ? TrendingUp : TrendingDown,
        change: undefined,
        isPositive: Math.abs(difHoy) <= 5,
      },
    ];
  }, [reportes]);

  if (loading) {
    return (
      <>
        {[0, 1, 2, 3].map((key) => (
          <Card key={key}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-28 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change ? (
              <p className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-destructive'}`}>
                {stat.change} {stat.description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
