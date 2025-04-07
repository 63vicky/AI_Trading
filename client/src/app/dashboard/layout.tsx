'use client';

import { DashboardNav } from '@/components/dashboard/nav';
import { DashboardHeader } from '@/components/dashboard/header';

// export const metadata: Metadata = {
//   title: 'Dashboard',
//   description: 'Manage your trading portfolio',
// };

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        {/* Desktop Navigation */}
        <aside className="fixed left-0 top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-[200px] flex-col border-r bg-background md:flex">
          <DashboardNav />
        </aside>

        <main className="flex-1 md:pl-[200px]">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
