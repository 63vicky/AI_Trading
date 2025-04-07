'use client';

import { UserAccountNav } from '@/components/dashboard/user-account-nav';
import { MainNav } from '@/components/dashboard/main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { DashboardNav } from '@/components/dashboard/nav';
import { useState } from 'react';

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky flex top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link
        href="/"
        className="hidden w-[200px] min-w-[200px] max-w-[200px] justify-center md:flex items-center space-x-2"
      >
        <span className="hidden font-bold sm:inline-block">
          AI Trading Platform
        </span>
      </Link>
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full min-w-auto !max-w-[240px] p-0"
              >
                <SheetTitle className="p-4 pt-8">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="">AI Trading Platform</span>
                  </Link>
                </SheetTitle>
                <DashboardNav />
              </SheetContent>
            </Sheet>
          </div>
          <MainNav />
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserAccountNav />
        </div>
      </div>
    </header>
  );
}
