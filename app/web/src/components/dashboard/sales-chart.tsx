'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockDailyReports } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

const chartData = mockDailyReports.map(report => ({
    date: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
    cash: report.salesCash,
    card: report.salesCard
})).reverse();

const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}k`;

// Lazy load Recharts para mejorar el rendimiento inicial
const SalesChartContent = dynamic(
  () => import('./sales-chart-content'),
  { 
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false 
  }
);

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Ventas Semanales</CardTitle>
        <CardDescription>Ventas en efectivo vs. tarjeta en los últimos 7 días.</CardDescription>
      </CardHeader>
      <CardContent>
        <SalesChartContent data={chartData} />
      </CardContent>
    </Card>
  );
}
