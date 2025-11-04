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
  
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
  
export async function RecentExpenses() {
    const expenses = mockExpenses.slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Expenses</CardTitle>
                <CardDescription>A log of the 5 most recent expenses.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Date</TableHead>
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
                                    <Badge variant="outline">{expense.category.replace('_', ' ')}</Badge>
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
