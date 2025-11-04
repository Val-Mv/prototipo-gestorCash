import { StatsCards } from '@/components/dashboard/stats-cards';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { AnomalyFeed } from '@/components/dashboard/anomaly-feed';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Daily Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<Skeleton className="h-32"/>}>
                <StatsCards />
            </Suspense>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Suspense fallback={<Skeleton className="h-[350px]"/>}>
                    <SalesChart />
                </Suspense>
            </div>
            <div>
                 <Suspense fallback={<Skeleton className="h-[350px]"/>}>
                    <AnomalyFeed />
                </Suspense>
            </div>
        </div>
        <div>
            <Suspense fallback={<Skeleton className="h-[300px]"/>}>
                <RecentExpenses />
            </Suspense>
        </div>
    </div>
  );
}
