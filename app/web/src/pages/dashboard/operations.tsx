import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { RecentExpenses } from "@/components/dashboard/recent-expenses"
import { AddExpenseForm } from "@/components/dashboard/add-expense-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { Gasto } from '@/lib/types';
import { obtenerGastos } from '@/lib/api/expenses';
import { useToast } from '@/hooks/use-toast';
  
export default function OperationsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const cargarGastos = async () => {
            try {
                const lista = await obtenerGastos({ limit: 20 });
                setGastos(lista);
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'No se pudieron cargar los gastos',
                    description: error?.message || 'Ocurrió un error al consultar el backend.',
                });
            }
        };

        cargarGastos();
    }, [toast]);

    const handleGastoAgregado = (nuevoGasto: Gasto) => {
        setGastos(prev => {
            const existente = prev.find(g => g.idGasto === nuevoGasto.idGasto);
            if (existente) {
                return prev.map(g => (g.idGasto === nuevoGasto.idGasto ? nuevoGasto : g));
            }
            return [nuevoGasto, ...prev];
        });
    };

    return (
        <div className="container mx-auto py-4">
            <Tabs defaultValue="expenses">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="expenses">Gastos</TabsTrigger>
                        <TabsTrigger value="sales">Ventas y Clientes</TabsTrigger>
                    </TabsList>
                    <Button 
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Gasto
                    </Button>
                </div>
                <TabsContent value="expenses">
                    <RecentExpenses gastos={gastos} />
                </TabsContent>
                <TabsContent value="sales">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Registrar Datos de Ventas y Clientes</CardTitle>
                            <CardDescription>Esta funcionalidad se implementará pronto.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
                            <p>El formulario de registro de ventas aparecerá aquí.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <AddExpenseForm
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onGastoAgregado={handleGastoAgregado}
            />
        </div>
    )
}

