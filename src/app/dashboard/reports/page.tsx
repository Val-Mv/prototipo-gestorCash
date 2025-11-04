'use client';

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

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function downloadCSV(data: typeof mockDailyReports) {
    const headers = ['Date', 'Customers', 'Cash Sales', 'Card Sales', 'Total Expenses', 'Over/Short', 'Anomalies'];
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
                        <CardTitle className="font-headline">Daily Reports</CardTitle>
                        <CardDescription>View and export daily financial summaries.</CardDescription>
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
                                <span>Pick a date</span>
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
                        <Button onClick={() => downloadCSV(filteredReports)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Customers</TableHead>
                                <TableHead>Cash Sales</TableHead>
                                <TableHead>Card Sales</TableHead>
                                <TableHead>Expenses</TableHead>
                                <TableHead>Over/Short</TableHead>
                                <TableHead>Anomalies</TableHead>
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
