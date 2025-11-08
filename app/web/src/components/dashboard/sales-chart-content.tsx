
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}k`;

export default function SalesChartContent({ data }: { data: Array<{ date: string; cash: number; card: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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
        <Bar dataKey="cash" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="Ventas en Efectivo"/>
        <Bar dataKey="card" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} name="Ventas con Tarjeta"/>
      </BarChart>
    </ResponsiveContainer>
  );
}

