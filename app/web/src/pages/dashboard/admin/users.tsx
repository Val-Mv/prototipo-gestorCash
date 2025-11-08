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
import { mockUsers, mockStores } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function UsersPage() {
    const { user } = useAuth();

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
        )
    }

    const users = Object.values(mockUsers);
    const getStoreName = (storeId?: string) => {
        if (!storeId) return 'N/A';
        return mockStores.find(s => s.id === storeId)?.name || 'Tienda Desconocida';
    }

    return (
        <div className="container mx-auto py-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Gestión de Usuarios</CardTitle>
                        <CardDescription>Agregar, editar o eliminar cuentas de usuario.</CardDescription>
                    </div>
                    <Button size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Usuario
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Tienda</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.uid}>
                                    <TableCell>
                                        <div className="font-medium">{u.displayName}</div>
                                        <div className="text-sm text-muted-foreground">{u.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{u.role}</Badge>
                                    </TableCell>
                                    <TableCell>{getStoreName(u.storeId)}</TableCell>
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
                                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Desactivar</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

