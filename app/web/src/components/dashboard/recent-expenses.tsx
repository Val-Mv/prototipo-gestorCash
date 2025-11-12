import { useEffect, useMemo, useState } from 'react';
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
import type { Gasto } from '@/lib/types';
import { obtenerGastos } from '@/lib/api/expenses';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
  
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const categoriaEtiquetas: Record<number, string> = {
    1: 'Suministros de Tienda',
    2: 'Mantenimiento',
    3: 'Papelería',
    4: 'Transporte',
};

const obtenerEtiquetaCategoria = (idCategoria: number) => {
    return categoriaEtiquetas[idCategoria] ?? `Categoría ${idCategoria}`;
}

interface RecentExpensesProps {
    gastos?: Gasto[];
}
  
export function RecentExpenses({ gastos: gastosPersonalizados }: RecentExpensesProps) {
    const { toast } = useToast();
    const [gastosBackend, setGastosBackend] = useState<Gasto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (gastosPersonalizados) return;

        const fetchGastos = async () => {
            try {
                setLoading(true);
                const data = await obtenerGastos({ limit: 5 });
                setGastosBackend(data);
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'No se pudieron cargar los gastos recientes',
                    description: error?.message ?? 'Intenta nuevamente más tarde.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchGastos();
    }, [gastosPersonalizados, toast]);

    const gastos = useMemo(() => {
        const origen = gastosPersonalizados ?? gastosBackend;
        return origen
            .slice()
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .slice(0, 5);
    }, [gastosPersonalizados, gastosBackend]);

    if (loading && gastos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Gastos Recientes</CardTitle>
                    <CardDescription>Cargando los últimos movimientos...</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        );
    }

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
                            <TableHead>Comprobante</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                            <TableHead>Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gastos.map((gasto) => (
                            <TableRow key={gasto.idGasto}>
                                <TableCell>
                                    <div className="font-medium">{gasto.numeroComprobante}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {gasto.descripcion}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{obtenerEtiquetaCategoria(gasto.idCategoria)}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(Number(gasto.monto))}</TableCell>
                                <TableCell>{new Date(gasto.fecha).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
