import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/overview';

export const metadata: Metadata = {
  title: 'Hashrate',
  description: 'Monitor your mining hashrate and performance',
};

export default function HashratePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Hashrate Monitor</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Hashrate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2 TH/s</div>
            <p className="text-xs text-green-600">+5% from average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Accepted Shares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/25</div>
            <p className="text-xs text-muted-foreground">Online workers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Power Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4 kW</div>
            <p className="text-xs text-muted-foreground">3.65 W/MH</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hashrate History</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Worker Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Worker 1</p>
                  <p className="text-sm text-muted-foreground">12.5 TH/s</p>
                </div>
                <div className="ml-auto font-medium text-green-600">Online</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Worker 2</p>
                  <p className="text-sm text-muted-foreground">15.8 TH/s</p>
                </div>
                <div className="ml-auto font-medium text-green-600">Online</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Worker 3</p>
                  <p className="text-sm text-muted-foreground">0 TH/s</p>
                </div>
                <div className="ml-auto font-medium text-red-600">Offline</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Worker 4</p>
                  <p className="text-sm text-muted-foreground">16.9 TH/s</p>
                </div>
                <div className="ml-auto font-medium text-green-600">Online</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
