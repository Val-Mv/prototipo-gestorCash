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
import { mockExpenses } from '@/lib/data';
import type { Expense } from '@/lib/types';
  
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
        'store_supplies': 'Suministros de Tienda',
        'maintenance': 'Mantenimiento',
        'paperwork': 'Papelería',
        'transport': 'Transporte'
    };
    return categories[category] || category;
}

interface RecentExpensesProps {
    expenses?: Expense[];
}
  
export function RecentExpenses({ expenses: customExpenses }: RecentExpensesProps) {
    // Combinar gastos personalizados con mock data, mostrando los más recientes primero
    const allExpenses = customExpenses 
        ? [...customExpenses, ...mockExpenses].sort((a, b) => b.createdAt - a.createdAt)
        : mockExpenses;
    const expenses = allExpenses.slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Gastos Recientes</CardTitle>
                <CardDescription>Registro de los 5 gastos más recientes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Artículo</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                            <TableHead>Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>
                                    <div className="font-medium">{expense.item}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {expense.description}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{getCategoryLabel(expense.category)}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(expense.amount)}</TableCell>
                                <TableCell>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
