'use client';

import Link from 'next/link';
import {
  Home,
  Users,
  Store,
  FileText,
  DollarSign,
  PanelLeft,
  LogOut,
  Archive,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/hooks/use-auth';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const navItems = [
    { href: '/dashboard', icon: Home, label: 'Panel de Control' },
    { href: '/dashboard/opening', icon: Archive, label: 'Conteo de Apertura' },
    { href: '/dashboard/operations', icon: DollarSign, label: 'Operaciones' },
    { href: '/dashboard/closing', icon: ShieldAlert, label: 'Cierre' },
    { href: '/dashboard/reports', icon: FileText, label: 'Reportes' },
    { href: '/dashboard/admin/users', icon: Users, label: 'Usuarios', roles: ['DM', 'SM'] },
    { href: '/dashboard/admin/stores', icon: Store, label: 'Tiendas', roles: ['DM'] },
];

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1 && segments[0] === 'dashboard') return 'Panel de Control';
    const current = navItems.find(item => item.href === pathname);
    if (current) return current.label;

    if(segments.length > 1) {
        const parent = navItems.find(item => item.href === `/${segments[0]}/${segments[1]}`);
        if(parent) return parent.label;
    }

    return 'GestorCash';
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Alternar Menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
             <Link
                href="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-all group-hover:scale-110"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M16.2 7.8a4 4 0 0 0-5.2-1.2"/><path d="M13 10h5.5"/><path d="M13 14h5.5"/><path d="M7.8 16.2a4 4 0 0 0 5.2 1.2"/></svg>
                <span className="sr-only">GestorCash</span>
              </Link>
            {navItems
              .filter(item => !item.roles || (user?.role && item.roles.includes(user.role)))
              .map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="hidden font-headline text-xl md:block">{getPageTitle()}</div>
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Search can be added here later */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={user?.displayName || 'User'} />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuItem>Soporte</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
