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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { useToast } from '@/hooks/use-toast';
import { getUsuarios, createUsuario, updateUsuario, cambiarEstadoUsuario, type Usuario } from '@/lib/api/usuarios';
import { getRoles, type Rol } from '@/lib/api/roles';
import { getStores, type Store } from '@/lib/api/stores';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

// Esquema base con campos comunes
const usuarioBaseSchema = z.object({
  nombreCompleto: z.string().min(1, 'El nombre es requerido').max(150),
  email: z.string().email('Email inválido').max(100),
  telefono: z
    .string()
    .max(20, 'El teléfono es demasiado largo')
    .optional()
    .or(z.literal(''))
    .transform((value) => (value === '' || !value ? undefined : value)),
  idRol: z.coerce.number().int().positive('Debe seleccionar un rol'),
  estadoActivo: z.boolean().default(true),
});

// Esquema para crear, extiende el base y hace la contraseña requerida
const createUsuarioSchema = usuarioBaseSchema.extend({
  contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(255),
});

// Esquema para actualizar, extiende el base y hace la contraseña opcional
const updateUsuarioSchema = usuarioBaseSchema.extend({
  contrasena: z.string().max(255).optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
}).refine(data => {
    // Si se proporciona contraseña, debe tener al menos 6 caracteres
    if (data.contrasena && data.contrasena.length > 0) {
      return data.contrasena.length >= 6;
    }
    return true;
  }, { message: 'La contraseña debe tener al menos 6 caracteres si se modifica', path: ['contrasena'] });

type UsuarioFormData = z.infer<typeof createUsuarioSchema> | z.infer<typeof updateUsuarioSchema>;

export default function UsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [deletingUsuario, setDeletingUsuario] = useState<Usuario | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Determina el esquema de validación basado en si estamos editando o no.
  const currentSchema = editingUsuario ? updateUsuarioSchema : createUsuarioSchema;

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      nombreCompleto: '',
      email: '',
      contrasena: '',
      telefono: '',
      idRol: undefined,
      estadoActivo: true,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    form.reset(undefined, { keepValues: true }); // Resetea el resolver sin borrar los valores
  }, [currentSchema, form]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usuariosData, rolesData, storesData] = await Promise.all([
        getUsuarios({ soloActivos: false }),
        getRoles(),
        getStores(false),
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
      setStores(storesData);
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

  const handleOpenDialog = (usuario?: Usuario) => {
    if (usuario) {
      setEditingUsuario(usuario);
      form.reset({
        nombreCompleto: usuario.nombreCompleto,
        email: usuario.email,
        contrasena: '', // No mostrar la contraseña
        telefono: usuario.telefono || '',
        idRol: usuario.idRol,
        estadoActivo: usuario.estadoActivo === 1, // Convertir 1/0 a boolean
      });
    } else {
      setEditingUsuario(null);
      form.reset({
        nombreCompleto: '',
        email: '',
        contrasena: '',
        telefono: '',
        estadoActivo: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUsuario(null);
    form.reset();
  };

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      setSubmitting(true);

      // Transformar datos para la API
      const apiData = {
        ...data,
        estadoActivo: data.estadoActivo ? 1 : 0, // Convertir boolean a 1/0
      };

      // Si la contraseña está vacía en la actualización, no la enviamos
      if (editingUsuario && !apiData.contrasena) {
        delete (apiData as any).contrasena;
      }

      if (editingUsuario) {
        await updateUsuario(editingUsuario.idUsuario, apiData);
        toast({
          title: 'Usuario actualizado',
          description: 'El usuario ha sido actualizado correctamente.',
        });
      } else {
        // Zod ya validó que la contraseña existe para la creación
        await createUsuario(apiData as any);
        toast({
          title: 'Usuario creado',
          description: 'El usuario ha sido creado correctamente.',
        });
      }

      await loadData();
      handleCloseDialog();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: editingUsuario ? 'Error al actualizar' : 'Error al crear',
        description: error.message || 'No se pudo guardar el usuario',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (usuario: Usuario) => {
    setDeletingUsuario(usuario);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingUsuario) return;

    try {
      // Usar el endpoint de cambio de estado
      const nuevoEstado = deletingUsuario.estadoActivo === 1 ? 0 : 1;
      await cambiarEstadoUsuario(deletingUsuario.idUsuario, nuevoEstado);
      toast({
        title: nuevoEstado === 1 ? 'Usuario activado' : 'Usuario desactivado',
        description: nuevoEstado === 1
          ? 'El usuario ha sido activado correctamente.'
          : 'El usuario ha sido desactivado correctamente.',
      });
      await loadData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al cambiar estado',
        description: error.message || 'No se pudo cambiar el estado del usuario',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingUsuario(null);
    }
  };

  const getRolName = (usuario: Usuario) => {
    // Priorizar nombreRol del JOIN si está disponible
    if (usuario.nombreRol) {
      return usuario.nombreRol;
    }
    // Fallback a buscar en roles
    const rol = roles.find(r => r.idRol === usuario.idRol);
    return rol?.nombreRol || 'Desconocido';
  };

  if (user?.role !== 'DM' && user?.role !== 'SM') {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-headline text-destructive">Acceso Denegado</CardTitle>
            <CardDescription>No tienes permiso para ver esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Por favor contacta a tu gerente de distrito si crees que esto es un error.</p>
          </CardContent>
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
    <div className="container mx-auto py-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Gestión de Usuarios</CardTitle>
            <CardDescription>Agregar, editar o eliminar cuentas de usuario.</CardDescription>
          </div>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((u) => (
                  <TableRow key={u.idUsuario}>
                    <TableCell className="font-medium">{u.nombreCompleto}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getRolName(u)}</Badge>
                    </TableCell>
                    <TableCell>{u.telefono || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={u.estadoActivo === 1 ? 'default' : 'destructive'}>
                        {u.estadoActivo === 1 ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.fechaCreacion
                        ? format(new Date(u.fechaCreacion), 'dd/MM/yyyy')
                        : 'N/A'}
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(u)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(u)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {u.estadoActivo === 1 ? 'Desactivar' : 'Activar'}
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

      {/* Dialog para crear/editar usuario */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingUsuario ? 'Editar Usuario' : 'Agregar Usuario'}
            </DialogTitle>
            <DialogDescription>
              {editingUsuario
                ? 'Actualiza la información del usuario.'
                : 'Completa el formulario para crear un nuevo usuario.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombreCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="usuario@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contrasena"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contraseña {editingUsuario && '(opcional - dejar vacío para no cambiar)'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={editingUsuario ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
                        {...field}
                        required={!editingUsuario}
                      />
                    </FormControl>
                    <FormMessage />
                    {editingUsuario && (
                      <p className="text-sm text-muted-foreground">
                        Deja este campo vacío si no deseas cambiar la contraseña
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idRol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((rol) => (
                          <SelectItem key={rol.idRol} value={rol.idRol.toString()}>
                            {rol.nombreRol}
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
                name="estadoActivo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <FormLabel>Usuario Activo</FormLabel>
                      <FormDescription>
                        Si está inactivo, el usuario no podrá iniciar sesión.
                      </FormDescription>
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
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingUsuario ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingUsuario?.estadoActivo === 1
                ? `Se desactivará el usuario ${deletingUsuario.nombreCompleto}. No podrá iniciar sesión hasta que sea reactivado.`
                : `Se activará el usuario ${deletingUsuario?.nombreCompleto}. Podrá iniciar sesión nuevamente.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {deletingUsuario?.estadoActivo === 1 ? 'Desactivar' : 'Activar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
