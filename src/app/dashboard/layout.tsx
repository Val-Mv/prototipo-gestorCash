import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { AuthProviderWrapper } from '@/components/auth/auth-provider-wrapper';
import type { AppUser } from '@/lib/types';

function DashboardView({ children }: { children: React.ReactNode, user: AppUser | null }) {
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col sm:pl-14">
        <Header />
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderWrapper>
      {(user) => <DashboardView user={user}>{children}</DashboardView>}
    </AuthProviderWrapper>
  );
}
