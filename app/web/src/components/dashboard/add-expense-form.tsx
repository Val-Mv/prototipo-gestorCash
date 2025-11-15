import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/hooks/use-auth';
import type { Gasto } from '@/lib/types';
import { crearGasto, type CrearGastoPayload } from '@/lib/api/expenses';

const categorias = [
  { clave: 'suministros', etiqueta: 'Suministros de Tienda', id: 1 },
  { clave: 'mantenimiento', etiqueta: 'Mantenimiento', id: 2 },
  { clave: 'papeleria', etiqueta: 'Papelería', id: 3 },
  { clave: 'transporte', etiqueta: 'Transporte', id: 4 },
] as const;

type CategoriaClave = (typeof categorias)[number]['clave'];

const categoriaPorClave = categorias.reduce<Record<CategoriaClave, { etiqueta: string; id: number }>>(
  (acc, cat) => {
    acc[cat.clave] = { etiqueta: cat.etiqueta, id: cat.id };
    return acc;
  },
  {} as Record<CategoriaClave, { etiqueta: string; id: number }>
);

const ESTADO_GASTO_REGISTRADO = 1;

const gastoSchema = z.object({
  categoriaClave: z.enum(categorias.map((c) => c.clave) as [CategoriaClave, ...CategoriaClave[]], {
    required_error: 'Debe seleccionar una categoría',
  }),
  monto: z.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  numeroComprobante: z
    .string()
    .min(3, 'El número de comprobante es obligatorio')
    .max(200, 'El número de comprobante no puede exceder 200 caracteres'),
  rutaComprobante: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),
  fecha: z
    .string()
    .optional()
    .refine(
      (val) => !val || !Number.isNaN(new Date(val).getTime()),
      'Debe ser una fecha válida'
    ),
});

type GastoFormData = z.infer<typeof gastoSchema>;

interface AddExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGastoAgregado?: (gasto: Gasto) => void;
}

export function AddExpenseForm({ open, onOpenChange, onGastoAgregado }: AddExpenseFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<GastoFormData>({
    resolver: zodResolver(gastoSchema),
    defaultValues: {
      monto: 0,
      descripcion: '',
      numeroComprobante: '',
      rutaComprobante: '',
      fecha: new Date().toISOString().split('T')[0],
    },
  });

  const estadoFormulario = form.formState;

  async function onSubmit(values: GastoFormData) {
    if (!user || (user.role !== 'SM' && user.role !== 'ASM')) {
      toast({
        variant: 'destructive',
        title: 'Acceso denegado',
        description: 'Solo los gerentes de tienda y asistentes pueden registrar gastos.',
      });
      return;
    }

    if (!user.idUsuario) {
      toast({
        variant: 'destructive',
        title: 'Usuario sin identificador',
        description: 'No se encontró el identificador del usuario para registrar el gasto.',
      });
      return;
    }

    const idCategoria = categoriaPorClave[values.categoriaClave].id;

    const payload: CrearGastoPayload = {
      fecha: values.fecha ? new Date(values.fecha).toISOString() : undefined,
      monto: values.monto,
      descripcion: values.descripcion.trim(),
      numeroComprobante: values.numeroComprobante.trim(),
      rutaComprobante: values.rutaComprobante?.trim() || 'SIN_COMPROBANTE',
      idCaja: null,
      idUsuarioRegistro: user.idUsuario,
      idUsuarioAprobacion: null,
      idCajaOrigen: null,
      idCategoria,
      idEstadoGasto: ESTADO_GASTO_REGISTRADO,
    };

    try {
      const nuevoGasto = await crearGasto(payload);

      toast({
        title: 'Gasto registrado',
        description: `Se registró el gasto ${values.numeroComprobante} por $${values.monto.toFixed(2)} en ${categoriaPorClave[values.categoriaClave].etiqueta}.`,
      });

      if (onGastoAgregado) {
        onGastoAgregado(nuevoGasto);
      }

      form.reset({
        monto: 0,
        descripcion: '',
        numeroComprobante: '',
        rutaComprobante: '',
        fecha: new Date().toISOString().split('T')[0],
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al registrar el gasto',
        description: error?.message || 'No fue posible registrar el gasto. Intenta nuevamente.',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Registrar nuevo gasto</DialogTitle>
          <DialogDescription>
            Completa la información del gasto operativo. Solo los gerentes de tienda y asistentes pueden registrar gastos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoriaClave"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.clave} value={categoria.clave}>
                          {categoria.etiqueta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el gasto en detalle..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Detalle el motivo del gasto (mínimo 10 caracteres)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numeroComprobante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de comprobante</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: COMP-001" {...field} />
                  </FormControl>
                  <FormDescription>Identificador del comprobante o referencia interna</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rutaComprobante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comprobante (URL) - Opcional</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL de la imagen del recibo o comprobante. Si no hay, se registrará como SIN_COMPROBANTE.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del gasto</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={estadoFormulario.isSubmitting}>
                {estadoFormulario.isSubmitting ? 'Guardando...' : 'Guardar gasto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

