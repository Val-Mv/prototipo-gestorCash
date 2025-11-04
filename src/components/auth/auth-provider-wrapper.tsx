'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import type { AppUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthProviderWrapper({ children }: { children: (user: AppUser | null) => React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="w-64 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
      </div>
    );
  }

  return <>{children(user)}</>;
}
