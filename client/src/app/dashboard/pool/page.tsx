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
  title: 'Mining Pool',
  description: 'View mining pool statistics and rewards',
};

export default function PoolPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mining Pool</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Hashrate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245.8 TH/s</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Miners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+5 in last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 BTC</div>
            <p className="text-xs text-muted-foreground">≈ $163,580.25</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pool Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1%</div>
            <p className="text-xs text-muted-foreground">PPLNS payment</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Height</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead className="text-right">Luck</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>835421</TableCell>
                  <TableCell>5 mins ago</TableCell>
                  <TableCell>6.25 BTC</TableCell>
                  <TableCell className="text-right text-green-600">
                    98%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>835420</TableCell>
                  <TableCell>15 mins ago</TableCell>
                  <TableCell>6.25 BTC</TableCell>
                  <TableCell className="text-right text-red-600">
                    105%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>835419</TableCell>
                  <TableCell>25 mins ago</TableCell>
                  <TableCell>6.25 BTC</TableCell>
                  <TableCell className="text-right text-green-600">
                    95%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Miners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miner</TableHead>
                  <TableHead>Hashrate</TableHead>
                  <TableHead>Share</TableHead>
                  <TableHead className="text-right">24h Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Miner1</TableCell>
                  <TableCell>45.2 TH/s</TableCell>
                  <TableCell>18.4%</TableCell>
                  <TableCell className="text-right">0.46 BTC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Miner2</TableCell>
                  <TableCell>32.8 TH/s</TableCell>
                  <TableCell>13.3%</TableCell>
                  <TableCell className="text-right">0.33 BTC</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Miner3</TableCell>
                  <TableCell>28.5 TH/s</TableCell>
                  <TableCell>11.6%</TableCell>
                  <TableCell className="text-right">0.29 BTC</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
