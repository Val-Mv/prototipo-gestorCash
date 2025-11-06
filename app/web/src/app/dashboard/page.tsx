import { StatsCards } from '@/components/dashboard/stats-cards';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { AnomalyFeed } from '@/components/dashboard/anomaly-feed';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight font-headline">Panel de Control Diario</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCards />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <SalesChart />
            </div>
            <div>
                <AnomalyFeed />
            </div>
        </div>
        <div>
            <RecentExpenses />
        </div>
    </div>
  );
}
