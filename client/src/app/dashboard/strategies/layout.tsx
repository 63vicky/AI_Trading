'use client';

interface StrategiesLayoutProps {
  children: React.ReactNode;
}

export default function StrategiesLayout({ children }: StrategiesLayoutProps) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}
