'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockRegisters, mockExpenses } from '@/lib/data';
import type { AnomalyDetectionAndAlertingOutput } from '@/ai/flows/anomaly-detection-and-alerting';
import { runAnomalyDetection } from '@/app/actions/closing';
import { useAuth } from '@/lib/hooks/use-auth';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const registerFields = mockRegisters
  .filter(r => r.active)
  .reduce((acc, register) => {
    acc[`register${register.number}`] = z.coerce.number().min(0, 'Debe ser un número positivo');
    return acc;
  }, {} as Record<string, z.ZodNumber>);

const formSchema = z.object({
  safe: z.coerce.number().min(0, 'Debe ser un número positivo'),
  salesCash: z.coerce.number().min(0, 'Debe ser un número positivo'),
  salesCard: z.coerce.number().min(0, 'Debe ser un número positivo'),
  customerCount: z.coerce.number().int().min(0, 'Debe ser un número entero positivo'),
  ...registerFields,
});

type FormData = z.infer<typeof formSchema>;

export default function ClosingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnomalyDetectionAndAlertingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalDifference, setTotalDifference] = useState<number | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      safe: 0,
      salesCash: 0,
      salesCard: 0,
      customerCount: 0,
      ...mockRegisters.filter(r => r.active).reduce((acc, r) => ({ ...acc, [`register${r.number}`]: 75 }), {}),
    },
  });

  // Calcular diferencia en tiempo real
  const watchedValues = form.watch();
  const [currentDifference, setCurrentDifference] = useState(0);

  useEffect(() => {
    const totalClosing = Object.keys(watchedValues)
      .filter(k => k.startsWith('register'))
      .reduce((sum, key) => sum + (Number(watchedValues[key as keyof FormData]) || 0), 0);
    const openingAmount = mockRegisters.filter(r => r.active).length * 75;
    const calculated = (totalClosing + (Number(watchedValues.safe) || 0)) - (openingAmount + (Number(watchedValues.salesCash) || 0));
    setCurrentDifference(calculated);
  }, [watchedValues]);

  async function onSubmit(values: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);

    const totalClosing = Object.keys(values)
      .filter(k => k.startsWith('register'))
      .reduce((sum, key) => sum + values[key as keyof FormData], 0);
      
    const openingAmount = mockRegisters.filter(r => r.active).length * 75;
    const calculatedDifference = (totalClosing + values.safe) - (openingAmount + values.salesCash);
    setTotalDifference(calculatedDifference);
    
    // Registrar timestamp y usuario responsable
    const timestamp = new Date().getTime();
    const closingData = {
      ...values,
      timestamp,
      userId: user?.uid || 'unknown',
      userName: user?.displayName || 'Usuario desconocido',
      date: new Date().toISOString().split('T')[0],
      totalDifference: calculatedDifference
    };
    console.log("Closing data with timestamp and user:", closingData);

    try {
      const res = await runAnomalyDetection({
        storeId: 'berwyn-il',
        date: new Date().toISOString().split('T')[0],
        expenses: mockExpenses.map(e => ({
            expenseId: e.id,
            category: e.category,
            item: e.item,
            amount: e.amount,
            description: e.description,
            attachmentUrl: e.attachmentUrl || null,
        })),
        salesCash: values.salesCash,
        salesCard: values.salesCard,
        totalDifference: calculatedDifference,
        customerCount: values.customerCount
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado durante el análisis.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Cierre de Fin de Día</CardTitle>
              <CardDescription>Ingresa los conteos finales para todos los registros y la caja fuerte. El sistema calculará las discrepancias y ejecutará la detección de anomalías.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Conteos de Registros</h3>
                {mockRegisters.filter(r => r.active).map(register => (
                  <FormField
                    key={register.id}
                    control={form.control}
                    name={`register${register.number}` as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registro #{register.number}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="75.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                 <FormField
                  control={form.control}
                  name="safe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteo de Caja Fuerte</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Datos de Ventas y Clientes</h3>
                <FormField
                  control={form.control}
                  name="salesCash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ventas Totales en Efectivo</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salesCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ventas Totales con Tarjeta</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteo de Clientes</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Validación de totales vs registros de caja */}
                {form.watch('salesCash') > 0 && form.watch('salesCard') > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Validación de Totales:</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ventas Totales: {formatCurrency(form.watch('salesCash') + form.watch('salesCard'))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total de Registros Activos: {mockRegisters.filter(r => r.active).length}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              {(Math.abs(currentDifference) > 5) && (
                <Alert variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Alerta: Diferencia Significativa</AlertTitle>
                  <AlertDescription>
                    La diferencia calculada es de {currentDifference > 0 ? '+' : ''}{formatCurrency(currentDifference)}, 
                    que excede el umbral permitido de $5.00. Por favor, verifica los conteos.
                  </AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analizar y Cerrar Día
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Análisis Fallido</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {result && (
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldAlert /> Análisis Completado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.anomalies.length > 0 ? (
                      <>
                        <Alert variant={result.shouldSendAlert ? 'destructive' : 'default'}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>{result.anomalies.length} {result.anomalies.length === 1 ? 'Anomalía' : 'Anomalías'} Detectada{result.anomalies.length === 1 ? '' : 's'}</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                                {result.anomalies.map((anomaly, i) => <li key={i}><strong>{anomaly.type}:</strong> {anomaly.message}</li>)}
                            </ul>
                          </AlertDescription>
                        </Alert>
                        {result.shouldSendAlert && (
                            <p className="mt-4 text-sm font-semibold text-destructive">Se ha enviado automáticamente una alerta a la gerencia debido a la gravedad de las anomalías.</p>
                        )}
                      </>
                    ) : (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>No se Detectaron Anomalías</AlertTitle>
                        <AlertDescription>El análisis de IA no encontró problemas significativos con los datos de hoy.</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
