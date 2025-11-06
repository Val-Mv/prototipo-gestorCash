'use client';

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
import { mockStores, mockRegisters } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

export default function StoresPage() {
    const { user } = useAuth();

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
        )
    }

    return (
        <div className="container mx-auto py-4 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Gestión de Tiendas</CardTitle>
                        <CardDescription>Activar o desactivar tiendas.</CardDescription>
                    </div>
                    <Button size="sm">
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
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockStores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell>{store.code}</TableCell>
                                    <TableCell>
                                        <Badge variant={store.active ? "default" : "destructive"}>
                                            {store.active ? "Activa" : "Inactiva"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell><Switch checked={store.active} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Gestión de Registros</CardTitle>
                        <CardDescription>Activar o desactivar registros para la tienda Berwyn.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Número de Registro</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockRegisters.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">Registro #{reg.number}</TableCell>
                                    <TableCell>
                                        <Badge variant={reg.active ? "default" : "destructive"}>
                                            {reg.active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell><Switch checked={reg.active} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
