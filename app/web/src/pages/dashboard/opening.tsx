import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CashRegister } from '@/lib/api/cash-registers';
import { getActiveCashRegisters } from '@/lib/api/cash-registers';
import { createConteo } from '@/lib/api/conteos';
import { createTipoConteo, getTiposConteo } from '@/lib/api/tipos-conteo';

const REQUIRED_OPENING_AMOUNT = 75;
const OPENING_COUNT_TYPE_NAME = 'APERTURA';

const formSchema = z.record(
  z.coerce.number().min(0, 'Debe ser un número positivo')
);
type FormData = z.infer<typeof formSchema>;

export default function OpeningPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [openingTypeId, setOpeningTypeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const activeRegisters = useMemo(
    () => registers.filter((register) => register.estadoActiva),
    [registers]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [registersResponse, tiposConteo] = await Promise.all([
          getActiveCashRegisters(true),
          getTiposConteo(),
        ]);

        setRegisters(registersResponse);

        let openingType = tiposConteo.find(
          (tipo) => tipo.nombreTipo.toUpperCase() === OPENING_COUNT_TYPE_NAME
        );

        if (!openingType) {
          openingType = await createTipoConteo({
            nombreTipo: OPENING_COUNT_TYPE_NAME,
          });
        }

        setOpeningTypeId(openingType.idTipoConteo);
        setErrorMessage(null);
      } catch (error: any) {
        console.error('Error loading opening data:', error);
        setErrorMessage(
          error?.message ||
          'No fue posible cargar la información necesaria para las aperturas.'
        );
        toast({
          variant: 'destructive',
          title: 'Error al cargar datos',
          description:
            'Revisa la conexión con el backend y vuelve a intentarlo.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    if (activeRegisters.length === 0) {
      form.reset({});
      return;
    }

    const defaults: FormData = {};
    activeRegisters.forEach((register) => {
      defaults[getFieldName(register)] = REQUIRED_OPENING_AMOUNT;
    });
    form.reset(defaults);
  }, [activeRegisters, form]);

  const getFieldName = (register: CashRegister) =>
    `register-${register.idCaja}`;

  function onSubmit(values: FormData) {
    if (!user?.idUsuario) {
      toast({
        variant: 'destructive',
        title: 'Usuario no identificado',
        description:
          'No se encontró el ID del usuario autenticado. Inicia sesión nuevamente.',
      });
      return;
    }

    if (!openingTypeId) {
      toast({
        variant: 'destructive',
        title: 'Tipo de conteo no disponible',
        description:
          'No fue posible determinar el tipo de conteo para la apertura. Intenta recargar la página.',
      });
      return;
    }

    if (submitting) return;

    let hasError = false;

    Object.entries(values).forEach(([key, value]) => {
      if (value !== REQUIRED_OPENING_AMOUNT) {
        form.setError(key as keyof FormData, {
          type: 'manual',
          message: `El conteo debe ser exactamente $${REQUIRED_OPENING_AMOUNT}.`,
        });
        hasError = true;
      }
    });

    if (hasError) {
      toast({
        variant: 'destructive',
        title: 'Conteo de apertura incorrecto',
        description:
          'Uno o más registros tienen un balance distinto al requerido. Corrige los valores resaltados.',
      });
      return;
    }

    const timestamp = new Date().toISOString();

    setSubmitting(true);
    Promise.all(
      activeRegisters.map(async (register) => {
        const fieldKey = getFieldName(register);
        const value = values[fieldKey];

        return createConteo({
          fechaHora: timestamp,
          montoContado: value,
          montoEsperado: REQUIRED_OPENING_AMOUNT,
          diferencia: value - REQUIRED_OPENING_AMOUNT,
          observaciones: null,
          idCaja: register.idCaja,
          idUsuario: user.idUsuario!,
          idTipoConteo: openingTypeId,
          idReporte: null,
        });
      })
    )
      .then(() => {
        toast({
          title: 'Conteos de apertura guardados',
          description:
            'Todos los conteos fueron registrados en la base de datos correctamente.',
        });
      })
      .catch((error: any) => {
        console.error('Error al registrar los conteos de apertura:', error);
        toast({
          variant: 'destructive',
          title: 'Error al guardar los conteos',
          description:
            error?.message ||
            'Ocurrió un problema al registrar los conteos. Intenta nuevamente.',
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className="container mx-auto py-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error al cargar datos</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activeRegisters.length === 0 ? (
        <Alert className="max-w-2xl mx-auto">
          <AlertTitle>No hay registradoras activas</AlertTitle>
          <AlertDescription>
            No se encontraron cajas registradoras activas para registrar la
            apertura. Verifica la configuración en el módulo de tiendas.
          </AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="font-headline">
                  Conteo de Apertura de Turno
                </CardTitle>
                <CardDescription>
                  Ingresa el monto inicial de efectivo para cada registro activo.
                  Cada uno debe tener exactamente {`$${REQUIRED_OPENING_AMOUNT}`}
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {activeRegisters.map((register) => (
                  <FormField
                    key={register.idCaja}
                    control={form.control}
                    name={getFieldName(register)}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Registro #{register.numeroCaja}
                          {form.getValues()[getFieldName(register)] !==
                            REQUIRED_OPENING_AMOUNT && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="75.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Guardar Conteos de Apertura
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      )}
    </div>
  );
}

