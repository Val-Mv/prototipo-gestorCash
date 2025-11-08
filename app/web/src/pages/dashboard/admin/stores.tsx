import { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getStores, createStore, updateStore, deleteStore, type Store } from '@/lib/api/stores';
import { getActiveCashRegisters, updateCashRegister, type CashRegister } from '@/lib/api/cash-registers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const storeSchema = z.object({
  id: z.string().min(1, 'El ID es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  active: z.boolean().default(true),
});

type StoreFormData = z.infer<typeof storeSchema>;

export default function StoresPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStore, setDeletingStore] = useState<Store | null>(null);
  const [isDeleteStoreDialogOpen, setIsDeleteStoreDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      id: '',
      name: '',
      code: '',
      active: true,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [storesData, registersData] = await Promise.all([
        getStores(false), // Obtener todas las tiendas, incluyendo inactivas
        getActiveCashRegisters(false), // Obtener todas las cajas registradoras, incluyendo inactivas
      ]);
      setStores(storesData);
      setRegisters(registersData);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al cargar datos',
        description: error.message || 'No se pudieron cargar los datos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStoreDialog = (store?: Store) => {
    if (store) {
      setEditingStore(store);
      form.reset({
        id: store.id,
        name: store.name,
        code: store.code,
        active: store.active,
      });
    } else {
      setEditingStore(null);
      form.reset({
        id: '',
        name: '',
        code: '',
        active: true,
      });
    }
    setIsStoreDialogOpen(true);
  };

  const handleCloseStoreDialog = () => {
    setIsStoreDialogOpen(false);
    setEditingStore(null);
    form.reset();
  };

  const onSubmitStore = async (data: StoreFormData) => {
    try {
      setSubmitting(true);
      
      // Asegurar que active sea un booleano
      const storeData = {
        ...data,
        active: Boolean(data.active),
      };
      
      if (editingStore) {
        await updateStore(editingStore.id, {
          name: storeData.name,
          code: storeData.code,
          active: storeData.active,
        });
        toast({
          title: 'Tienda actualizada',
          description: 'La tienda ha sido actualizada correctamente.',
        });
      } else {
        await createStore(storeData);
        toast({
          title: 'Tienda creada',
          description: 'La tienda ha sido creada correctamente.',
        });
      }
      
      await loadData();
      handleCloseStoreDialog();
    } catch (error: any) {
      console.error('Error al guardar tienda:', error);
      const errorMessage = error.message || error.error || 'No se pudo guardar la tienda';
      const errorDetails = error.details || error.detalles || [];
      
      // Si hay detalles de error de Zod, establecerlos en el formulario
      if (Array.isArray(errorDetails) && errorDetails.length > 0) {
        errorDetails.forEach((detail: any) => {
          if (detail.path && detail.path.length > 0) {
            const fieldName = detail.path[0] as keyof StoreFormData;
            form.setError(fieldName, {
              message: detail.message || errorMessage,
            });
          }
        });
      }
      
      // Mostrar mensaje de error en toast
      const displayMessage = Array.isArray(errorDetails) && errorDetails.length > 0
        ? errorDetails.map((d: any) => d.message || d).join(', ')
        : errorMessage;
      
      toast({
        variant: 'destructive',
        title: editingStore ? 'Error al actualizar' : 'Error al crear',
        description: displayMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStoreActive = async (store: Store) => {
    try {
      await updateStore(store.id, { active: !store.active });
      toast({
        title: store.active ? 'Tienda desactivada' : 'Tienda activada',
        description: `La tienda ${store.name} ha sido ${store.active ? 'desactivada' : 'activada'} correctamente.`,
      });
      await loadData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el estado de la tienda',
      });
    }
  };

  const handleDeleteStore = (store: Store) => {
    setDeletingStore(store);
    setIsDeleteStoreDialogOpen(true);
  };

  const confirmDeleteStore = async () => {
    if (!deletingStore) return;

    try {
      await deleteStore(deletingStore.id);
      toast({
        title: 'Tienda desactivada',
        description: 'La tienda ha sido desactivada correctamente.',
      });
      await loadData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al desactivar',
        description: error.message || 'No se pudo desactivar la tienda',
      });
    } finally {
      setIsDeleteStoreDialogOpen(false);
      setDeletingStore(null);
    }
  };

  const handleToggleRegisterActive = async (register: CashRegister) => {
    try {
      await updateCashRegister(register.idCaja, {
        estadoActiva: !register.estadoActiva,
      });
      toast({
        title: register.estadoActiva ? 'Registro desactivado' : 'Registro activado',
        description: `El registro ${register.numeroCaja} ha sido ${register.estadoActiva ? 'desactivado' : 'activado'} correctamente.`,
      });
      await loadData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el estado del registro',
      });
    }
  };

  if (user?.role !== 'DM') {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-destructive">Acceso Denegado</CardTitle>
            <CardDescription>Solo los Gerentes de Distrito pueden acceder a esta página.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Gestión de Tiendas</CardTitle>
            <CardDescription>Agregar, editar, activar o desactivar tiendas.</CardDescription>
          </div>
          <Button size="sm" onClick={() => handleOpenStoreDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Tienda
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de Tienda</TableHead>
                <TableHead>Código de Tienda</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Activar/Desactivar</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay tiendas registradas
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.code}</TableCell>
                    <TableCell>
                      <Badge variant={store.active ? 'default' : 'destructive'}>
                        {store.active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={store.active}
                        onCheckedChange={() => handleToggleStoreActive(store)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Alternar menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenStoreDialog(store)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteStore(store)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Desactivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Gestión de Registros</CardTitle>
            <CardDescription>Activar o desactivar registros.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Registro</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Monto Inicial Requerido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Activar/Desactivar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay registros registrados
                  </TableCell>
                </TableRow>
              ) : (
                registers.map((reg) => (
                  <TableRow key={reg.idCaja}>
                    <TableCell className="font-medium">Registro #{reg.numeroCaja}</TableCell>
                    <TableCell>{reg.ubicacion || 'N/A'}</TableCell>
                    <TableCell>${reg.montoInicialRequerido.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={reg.estadoActiva ? 'default' : 'destructive'}>
                        {reg.estadoActiva ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={reg.estadoActiva}
                        onCheckedChange={() => handleToggleRegisterActive(reg)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para crear/editar tienda */}
      <Dialog open={isStoreDialogOpen} onOpenChange={handleCloseStoreDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingStore ? 'Editar Tienda' : 'Agregar Tienda'}
            </DialogTitle>
            <DialogDescription>
              {editingStore 
                ? 'Actualiza la información de la tienda.' 
                : 'Completa el formulario para crear una nueva tienda.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitStore)} className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID de Tienda</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="berwyn-il" 
                        {...field}
                        disabled={!!editingStore}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      />
                    </FormControl>
                    <FormMessage />
                    {editingStore && (
                      <p className="text-sm text-muted-foreground">
                        El ID no puede ser modificado
                      </p>
                    )}
                    {!editingStore && (
                      <p className="text-sm text-muted-foreground">
                        El ID debe ser único y en formato kebab-case (ej: berwyn-il)
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Tienda</FormLabel>
                    <FormControl>
                      <Input placeholder="Berwyn Store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Tienda</FormLabel>
                    <FormControl>
                      <Input placeholder="BRW001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Tienda Activa</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseStoreDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingStore ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación de tienda */}
      <AlertDialog open={isDeleteStoreDialogOpen} onOpenChange={setIsDeleteStoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se desactivará la tienda {deletingStore?.name}. Esto no eliminará la tienda permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStore}>
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
