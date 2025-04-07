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
  title: 'Trades',
  description: 'View and manage your trades',
};

export default function TradesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Trades</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 in profit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PnL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$1,234.56</div>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$102.45</div>
            <p className="text-xs text-muted-foreground">Per trade</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pair</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead className="text-right">PnL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>BTC/USDT</TableCell>
                <TableCell>Long</TableCell>
                <TableCell>$64,350.00</TableCell>
                <TableCell>$65,432.10</TableCell>
                <TableCell className="text-right text-green-600">
                  +$1,082.10
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ETH/USDT</TableCell>
                <TableCell>Short</TableCell>
                <TableCell>$3,450.00</TableCell>
                <TableCell>$3,245.67</TableCell>
                <TableCell className="text-right text-green-600">
                  +$204.33
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>BNB/USDT</TableCell>
                <TableCell>Long</TableCell>
                <TableCell>$445.00</TableCell>
                <TableCell>$432.18</TableCell>
                <TableCell className="text-right text-red-600">
                  -$12.82
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Pair</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry/Exit</TableHead>
                <TableHead className="text-right">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-04-07</TableCell>
                <TableCell>BTC/USDT</TableCell>
                <TableCell>Long</TableCell>
                <TableCell>$63,245 / $64,350</TableCell>
                <TableCell className="text-right text-green-600">
                  +$1,105.00
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-04-06</TableCell>
                <TableCell>ETH/USDT</TableCell>
                <TableCell>Short</TableCell>
                <TableCell>$3,560 / $3,450</TableCell>
                <TableCell className="text-right text-green-600">
                  +$110.00
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-04-06</TableCell>
                <TableCell>BNB/USDT</TableCell>
                <TableCell>Long</TableCell>
                <TableCell>$458 / $445</TableCell>
                <TableCell className="text-right text-red-600">
                  -$13.00
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
