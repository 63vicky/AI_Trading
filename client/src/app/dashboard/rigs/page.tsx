import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const metadata: Metadata = {
  title: 'Mining Rigs',
  description: 'Manage and monitor your mining rigs',
};

export default function RigsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mining Rigs</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rigs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">24 online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Hashrate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2 TH/s</div>
            <p className="text-xs text-green-600">+2.3% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Power Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4 kW</div>
            <p className="text-xs text-muted-foreground">$892/month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.65 W/MH</div>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Rig Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rig Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hashrate</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Power</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Rig-01</TableCell>
                <TableCell>
                  <span className="text-green-600">● Online</span>
                </TableCell>
                <TableCell>2.5 TH/s</TableCell>
                <TableCell>65°C</TableCell>
                <TableCell>850W</TableCell>
                <TableCell>3.4 W/MH</TableCell>
                <TableCell className="text-right">5d 12h</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rig-02</TableCell>
                <TableCell>
                  <span className="text-green-600">● Online</span>
                </TableCell>
                <TableCell>2.8 TH/s</TableCell>
                <TableCell>62°C</TableCell>
                <TableCell>920W</TableCell>
                <TableCell>3.3 W/MH</TableCell>
                <TableCell className="text-right">12d 5h</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rig-03</TableCell>
                <TableCell>
                  <span className="text-red-600">● Offline</span>
                </TableCell>
                <TableCell>0 TH/s</TableCell>
                <TableCell>--</TableCell>
                <TableCell>0W</TableCell>
                <TableCell>--</TableCell>
                <TableCell className="text-right">--</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rig-04</TableCell>
                <TableCell>
                  <span className="text-green-600">● Online</span>
                </TableCell>
                <TableCell>2.6 TH/s</TableCell>
                <TableCell>68°C</TableCell>
                <TableCell>880W</TableCell>
                <TableCell>3.4 W/MH</TableCell>
                <TableCell className="text-right">3d 8h</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Temperature Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Temperature chart will be implemented here
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Power Consumption History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Power consumption chart will be implemented here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
