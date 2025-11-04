import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { mockDailyReports } from '@/lib/data';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export async function StatsCards() {
    // In a real app, this would be a fetch call
    const todayReport = mockDailyReports[0];
    const yesterdayReport = mockDailyReports[1];

    const totalSales = todayReport.salesCash + todayReport.salesCard;
    const prevTotalSales = yesterdayReport.salesCash + yesterdayReport.salesCard;
    const salesChange = totalSales - prevTotalSales;
    const salesChangePercentage = (salesChange / prevTotalSales) * 100;

    const customerChange = todayReport.customers - yesterdayReport.customers;
    const customerChangePercentage = (customerChange / yesterdayReport.customers) * 100;

    const stats = [
        {
            title: "Total Sales",
            value: formatCurrency(totalSales),
            change: `${salesChange > 0 ? '+' : ''}${salesChangePercentage.toFixed(1)}%`,
            description: "from yesterday",
            icon: DollarSign,
            isPositive: salesChange > 0
        },
        {
            title: "Customer Count",
            value: todayReport.customers.toString(),
            change: `${customerChange > 0 ? '+' : ''}${customerChangePercentage.toFixed(1)}%`,
            description: "from yesterday",
            icon: Users,
            isPositive: customerChange > 0
        },
        {
            title: "Total Expenses",
            value: formatCurrency(todayReport.totalExpenses),
            description: "for today",
            icon: TrendingDown
        },
        {
            title: "Over / Short",
            value: formatCurrency(todayReport.totalDifference),
            description: "for today",
            icon: todayReport.totalDifference >= 0 ? TrendingUp : TrendingDown,
            isPositive: todayReport.totalDifference < 5 && todayReport.totalDifference > -5
        }
    ];

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
                        {stat.change && (
                             <p className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-destructive'}`}>
                                {stat.change} {stat.description}
                            </p>
                        )}
                        {!stat.change && (
                             <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </>
    );
}
