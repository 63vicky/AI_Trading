'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-4">
      <nav className="hidden items-center space-x-4 text-sm font-medium md:flex">
        <Link
          href="/dashboard"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/portfolio"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/dashboard/portfolio')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Portfolio
        </Link>
        <Link
          href="/dashboard/strategies"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/dashboard/strategies')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Strategies
        </Link>
      </nav>
    </div>
  );
}
