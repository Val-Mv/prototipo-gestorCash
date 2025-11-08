import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRegisters } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

const REQUIRED_OPENING_AMOUNT = 75;

const registerFields = mockRegisters
  .filter(r => r.active)
  .reduce((acc, register) => {
    acc[`register${register.number}`] = z.coerce
      .number()
      .min(0, 'Debe ser un número positivo')
    return acc;
  }, {} as Record<string, z.ZodNumber>);
  
const formSchema = z.object(registerFields);
type FormData = z.infer<typeof formSchema>;


export default function OpeningPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: mockRegisters.filter(r => r.active).reduce((acc, r) => ({ ...acc, [`register${r.number}`]: REQUIRED_OPENING_AMOUNT }), {}),
  });

  function onSubmit(values: FormData) {
    let hasError = false;
    Object.entries(values).forEach(([key, value]) => {
        if (value !== REQUIRED_OPENING_AMOUNT) {
            form.setError(key as keyof FormData, {
                type: 'manual',
                message: `El conteo debe ser exactamente $${REQUIRED_OPENING_AMOUNT}.`
            });
            hasError = true;
        }
    });

    if (hasError) {
        toast({
            variant: "destructive",
            title: "Conteo de Apertura Incorrecto",
            description: "Uno o más registros tienen un balance de apertura incorrecto. Por favor corrígelos.",
        });
    } else {
        // Registrar timestamp y usuario responsable
        const timestamp = new Date().getTime();
        const openingData = {
            ...values,
            timestamp,
            userId: user?.uid || 'unknown',
            userName: user?.displayName || 'Usuario desconocido',
            date: new Date().toISOString().split('T')[0],
            registerId: 'all-active-registers'
        };
        
        toast({
            title: "Conteos de Apertura Guardados",
            description: "Todos los conteos de registros han sido registrados exitosamente.",
        });
        console.log("Opening counts submitted:", openingData);
        // TODO: Guardar en base de datos con timestamp y usuario
    }
  }

  return (
    <div className="container mx-auto py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-headline">Conteo de Apertura de Turno</CardTitle>
              <CardDescription>Ingresa el monto inicial de efectivo para cada registro activo. Cada uno debe tener exactamente {`$${REQUIRED_OPENING_AMOUNT}`}.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {mockRegisters.filter(r => r.active).map(register => (
                  <FormField
                    key={register.id}
                    control={form.control}
                    name={`register${register.number}` as keyof FormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            Registro #{register.number}
                            {form.getValues()[`register${register.number}` as keyof FormData] !== REQUIRED_OPENING_AMOUNT &&
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            }
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
              <Button type="submit">Guardar Conteos de Apertura</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

