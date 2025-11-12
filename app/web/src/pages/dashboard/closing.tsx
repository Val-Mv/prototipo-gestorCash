import { useState, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import type { SalidaDeteccionAnomalias } from '@/lib/ai/anomaly-detection';
import { detectarAnomaliasYAlertar } from '@/lib/ai/anomaly-detection';
import { useAuth } from '@/lib/hooks/use-auth';
import { getActiveCashRegisters, type CashRegister } from '@/lib/api/cash-registers';
import { obtenerGastos } from '@/lib/api/expenses';
import type { Gasto } from '@/lib/types';

const formSchema = z.object({
  safe: z.coerce.number().min(0, 'Debe ser un número positivo'),
  salesCash: z.coerce.number().min(0, 'Debe ser un número positivo'),
  salesCard: z.coerce.number().min(0, 'Debe ser un número positivo'),
  customerCount: z.coerce.number().int().min(0, 'Debe ser un número entero positivo'),
});

type BaseFormData = z.infer<typeof formSchema>;
type FormData = BaseFormData & Record<string, number>;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const nombreCampoRegistro = (register: CashRegister) => `register_${register.idCaja}`;

export default function ClosingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SalidaDeteccionAnomalias | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalDifference, setTotalDifference] = useState<number | null>(null);
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [defaultsApplied, setDefaultsApplied] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      safe: 0,
      salesCash: 0,
      salesCard: 0,
      customerCount: 0,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [registerData, gastosData] = await Promise.all([
          getActiveCashRegisters(true),
          obtenerGastos({ limit: 50 }),
        ]);
        setRegisters(registerData.filter((r) => r.estadoActiva));
        setGastos(gastosData);
      } catch (err) {
        console.error('Error cargando datos para cierre:', err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (registers.length === 0 || defaultsApplied) {
      return;
    }

    const nuevosValores: Partial<FormData> = {};
    registers.forEach((register) => {
      nuevosValores[nombreCampoRegistro(register)] = Number(register.montoInicialRequerido) || 0;
    });

    form.reset({
      safe: 0,
      salesCash: 0,
      salesCard: 0,
      customerCount: 0,
      ...nuevosValores,
    });
    setDefaultsApplied(true);
  }, [registers, form, defaultsApplied]);

  const watchedValues = form.watch();
  const currentDifference = useMemo(() => {
    const totalClosing = registers.reduce((sum, register) => {
      const key = nombreCampoRegistro(register);
      return sum + (Number(watchedValues[key]) || 0);
    }, 0);

    const openingAmount = registers.reduce(
      (sum, register) => sum + (Number(register.montoInicialRequerido) || 0),
      0
    );

    return (
      totalClosing +
      (Number(watchedValues.safe) || 0) -
      (openingAmount + (Number(watchedValues.salesCash) || 0))
    );
  }, [registers, watchedValues]);

  async function onSubmit(values: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);

    const totalClosing = registers.reduce((sum, register) => {
      const key = nombreCampoRegistro(register);
      return sum + (Number(values[key]) || 0);
    }, 0);

    const openingAmount = registers.reduce(
      (sum, register) => sum + (Number(register.montoInicialRequerido) || 0),
      0
    );

    const calculatedDifference = totalClosing + values.safe - (openingAmount + values.salesCash);
    setTotalDifference(calculatedDifference);

    try {
      const res = await detectarAnomaliasYAlertar({
        idTienda: 'berwyn-il',
        fecha: new Date().toISOString().split('T')[0],
        gastos: gastos.map((gasto) => ({
          idGasto: gasto.idGasto,
          idCategoria: gasto.idCategoria,
          monto: Number(gasto.monto),
          descripcion: gasto.descripcion,
        })),
        ventasEfectivo: values.salesCash,
        ventasTarjeta: values.salesCard,
        diferenciaTotal: calculatedDifference,
        cantidadClientes: values.customerCount,
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
              <CardDescription>
                Ingresa los conteos finales para todos los registros y la caja fuerte. El sistema
                calculará las discrepancias y ejecutará la detección de anomalías.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Conteos de Registros</h3>
                {registers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No se encontraron cajas registradoras activas.
                  </p>
                ) : (
                  registers.map((register) => (
                    <FormField
                      key={register.idCaja}
                      control={form.control}
                      name={nombreCampoRegistro(register) as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registro #{register.numeroCaja}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))
                )}
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
                {form.watch('salesCash') > 0 && form.watch('salesCard') > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Validación de Totales:</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ventas Totales:{' '}
                      {formatCurrency(form.watch('salesCash') + form.watch('salesCard'))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total de Registros Activos: {registers.length}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              {Math.abs(currentDifference) > 5 && (
                <Alert variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Alerta: Diferencia Significativa</AlertTitle>
                  <AlertDescription>
                    La diferencia calculada es de {currentDifference > 0 ? '+' : ''}
                    {formatCurrency(currentDifference)}, que excede el umbral permitido de $5.00. Por
                    favor, verifica los conteos.
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
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert /> Análisis Completado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.anomalias.length > 0 ? (
                      <>
                        <Alert variant={result.debeEnviarAlerta ? 'destructive' : 'default'}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>
                            {result.anomalias.length}{' '}
                            {result.anomalias.length === 1 ? 'Anomalía' : 'Anomalías'} detectada
                            {result.anomalias.length === 1 ? '' : 's'}
                          </AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                              {result.anomalias.map((anomalia, i) => (
                                <li key={i}>
                                  <strong>{anomalia.tipo}:</strong> {anomalia.mensaje}
                                </li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                        {result.debeEnviarAlerta && (
                          <p className="mt-4 text-sm font-semibold text-destructive">
                            Se ha enviado automáticamente una alerta a la gerencia debido a la
                            gravedad de las anomalías.
                          </p>
                        )}
                      </>
                    ) : (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>No se Detectaron Anomalías</AlertTitle>
                        <AlertDescription>
                          El análisis no encontró problemas significativos con los datos de hoy.
                        </AlertDescription>
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

