import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDailyReports } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import React from 'react';
import * as XLSX from 'xlsx';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function downloadCSV(data: typeof mockDailyReports) {
    const headers = ['Fecha', 'Clientes', 'Ventas en Efectivo', 'Ventas con Tarjeta', 'Gastos Totales', 'Sobrante/Faltante', 'Anomalías'];
    const rows = data.map(row => [
        row.date,
        row.customers,
        row.salesCash,
        row.salesCard,
        row.totalExpenses,
        row.totalDifference.toFixed(2),
        row.anomalies.map(a => a.message).join(' | ')
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daily_reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadXLSX(data: typeof mockDailyReports) {
    const worksheetData = [
        ['Fecha', 'Clientes', 'Ventas en Efectivo', 'Ventas con Tarjeta', 'Gastos Totales', 'Sobrante/Faltante', 'Anomalías'],
        ...data.map(row => [
            row.date,
            row.customers,
            row.salesCash,
            row.salesCard,
            row.totalExpenses,
            row.totalDifference.toFixed(2),
            row.anomalies.map(a => a.message).join(' | ')
        ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reportes Diarios');
    
    // Agregar hoja de resumen por categoría
    const expensesByCategory = data.reduce((acc, report) => {
        // Esto es un ejemplo, necesitarías datos reales de gastos por categoría
        return acc;
    }, {} as Record<string, number>);
    
    XLSX.writeFile(workbook, `reportes_diarios_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
}

export default function ReportsPage() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: new Date(),
    });

    const filteredReports = mockDailyReports.filter(report => {
        const reportDate = new Date(report.date);
        if (!date?.from || !date?.to) return true;
        return reportDate >= date.from && reportDate <= date.to;
    });

    return (
        <div className="container mx-auto py-4">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="font-headline">Reportes Diarios</CardTitle>
                        <CardDescription>Ver y exportar resúmenes financieros diarios.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 pt-4 md:pt-0">
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Seleccionar fecha</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                            </PopoverContent>
                        </Popover>
                        <Button 
                            variant="outline"
                            onClick={() => downloadCSV(filteredReports)}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Exportar CSV
                        </Button>
                        <Button onClick={() => downloadXLSX(filteredReports)}>
                            <Download className="mr-2 h-4 w-4" />
                            Exportar XLSX
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Clientes</TableHead>
                                <TableHead>Ventas en Efectivo</TableHead>
                                <TableHead>Ventas con Tarjeta</TableHead>
                                <TableHead>Gastos</TableHead>
                                <TableHead>Sobrante/Faltante</TableHead>
                                <TableHead>Anomalías</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">{report.date}</TableCell>
                                    <TableCell>{report.customers}</TableCell>
                                    <TableCell>{formatCurrency(report.salesCash)}</TableCell>
                                    <TableCell>{formatCurrency(report.salesCard)}</TableCell>
                                    <TableCell>{formatCurrency(report.totalExpenses)}</TableCell>
                                    <TableCell className={cn(report.totalDifference < -5 || report.totalDifference > 5 ? 'text-destructive' : 'text-green-600', 'font-semibold')}>
                                        {formatCurrency(report.totalDifference)}
                                    </TableCell>
                                    <TableCell>
                                        {report.anomalies.length > 0 ? (
                                            <Badge variant="destructive">{report.anomalies.length}</Badge>
                                        ) : (
                                            <Badge variant="secondary">0</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

