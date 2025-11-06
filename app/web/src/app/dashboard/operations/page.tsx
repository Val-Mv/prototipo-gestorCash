'use client';

import { useState } from 'react';
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
import type { Expense } from '@/lib/types';
  
export default function OperationsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const handleExpenseAdded = (newExpense: Expense) => {
        // Agregar el nuevo gasto a la lista
        setExpenses(prev => [newExpense, ...prev]);
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
                    <RecentExpenses expenses={expenses} />
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
                onExpenseAdded={handleExpenseAdded}
            />
        </div>
    )
}
