'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mockDailyReports } from '@/lib/data';

const chartData = mockDailyReports.map(report => ({
    date: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
    cash: report.salesCash,
    card: report.salesCard
})).reverse();


const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}k`;

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Weekly Sales</CardTitle>
        <CardDescription>Cash vs. Card sales over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                }}
                formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
             />
            <Legend wrapperStyle={{fontSize: "14px"}}/>
            <Bar dataKey="cash" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="Cash Sales"/>
            <Bar dataKey="card" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} name="Card Sales"/>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
