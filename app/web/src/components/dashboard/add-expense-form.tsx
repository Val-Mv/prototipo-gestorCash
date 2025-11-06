'use client';

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
import type { Expense } from '@/lib/types';

const expenseSchema = z.object({
  category: z.enum(['store_supplies', 'maintenance', 'paperwork', 'transport'], {
    required_error: 'Debe seleccionar una categoría',
  }),
  item: z.string().min(1, 'El ítem es obligatorio').min(3, 'El ítem debe tener al menos 3 caracteres'),
  amount: z.coerce.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es obligatoria').min(10, 'La descripción debe tener al menos 10 caracteres'),
  attachmentUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded?: (expense: Expense) => void;
}

const categoryLabels: Record<string, string> = {
  'store_supplies': 'Suministros de Tienda',
  'maintenance': 'Mantenimiento',
  'paperwork': 'Papelería',
  'transport': 'Transporte',
};

export function AddExpenseForm({ open, onOpenChange, onExpenseAdded }: AddExpenseFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: undefined,
      item: '',
      amount: 0,
      description: '',
      attachmentUrl: '',
    },
  });

  function onSubmit(values: ExpenseFormData) {
    // Validar que el usuario tenga permisos (SM o ASM)
    if (!user || (user.role !== 'SM' && user.role !== 'ASM')) {
      toast({
        variant: 'destructive',
        title: 'Acceso Denegado',
        description: 'Solo los gerentes de tienda y asistentes pueden registrar gastos.',
      });
      return;
    }

    // Crear el objeto de gasto con asociación a día y caja
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      category: values.category,
      item: values.item,
      amount: values.amount,
      description: values.description,
      attachmentUrl: values.attachmentUrl || undefined,
      createdAt: new Date().getTime(),
      storeId: user?.storeId || 'berwyn-il', // Asociar a la tienda del usuario
      date: new Date().toISOString().split('T')[0], // Asociar al día actual
      userId: user?.uid, // Usuario que registró el gasto
    };

    // Llamar al callback si existe
    if (onExpenseAdded) {
      onExpenseAdded(newExpense);
    }

    // Mostrar mensaje de éxito
    toast({
      title: 'Gasto Registrado',
      description: `Se ha registrado el gasto de ${values.item} por $${values.amount.toFixed(2)}.`,
    });

    // Resetear el formulario y cerrar el diálogo
    form.reset();
    onOpenChange(false);

    // TODO: Guardar en base de datos
    console.log('New expense:', newExpense);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Agregar Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Registra un gasto operativo. Solo los gerentes de tienda y asistentes pueden registrar gastos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="store_supplies">Suministros de Tienda</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="paperwork">Papelería</SelectItem>
                      <SelectItem value="transport">Transporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ítem</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Spray Limpiador" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nombre del artículo o servicio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
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
              name="description"
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
                  <FormDescription>
                    Proporciona detalles sobre el gasto (al menos 10 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attachmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soporte (URL de Imagen) - Opcional</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL de la imagen del recibo o comprobante
                  </FormDescription>
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
              <Button type="submit">Guardar Gasto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

