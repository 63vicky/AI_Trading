'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  LineChart,
  Settings,
  Wallet,
  BarChart3,
  Hash,
  Database,
  TrendingUp,
} from 'lucide-react';

const items = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Market',
    href: '/dashboard/market',
    icon: TrendingUp,
  },
  {
    title: 'Trades',
    href: '/dashboard/trades',
    icon: LineChart,
  },
  {
    title: 'Pool',
    href: '/dashboard/pool',
    icon: Database,
  },
  {
    title: 'Hashrate',
    href: '/dashboard/hashrate',
    icon: Hash,
  },
  {
    title: 'Rigs',
    href: '/dashboard/rigs',
    icon: BarChart3,
  },
  {
    title: 'Portfolio',
    href: '/dashboard/portfolio',
    icon: Wallet,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 p-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start',
                pathname === item.href && 'bg-muted'
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="text-sm">{item.title}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
