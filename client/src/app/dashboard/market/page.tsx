import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Market',
  description: 'View market data and trends',
};

export default function MarketPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Market Overview</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bitcoin (BTC)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$65,432.10</div>
            <p className="text-xs text-green-600">+2.5% (24h)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ethereum (ETH)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,245.67</div>
            <p className="text-xs text-red-600">-1.2% (24h)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.45T</div>
            <p className="text-xs text-muted-foreground">Global</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124.5B</div>
            <p className="text-xs text-muted-foreground">Global</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add price chart component here */}
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              Price chart will be implemented here
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Market Pairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">BTC/USDT</p>
                  <p className="text-sm text-muted-foreground">Binance</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-medium">$65,432.10</p>
                  <p className="text-sm text-green-600">+2.5%</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">ETH/USDT</p>
                  <p className="text-sm text-muted-foreground">Binance</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-medium">$3,245.67</p>
                  <p className="text-sm text-red-600">-1.2%</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">BNB/USDT</p>
                  <p className="text-sm text-muted-foreground">Binance</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-medium">$432.18</p>
                  <p className="text-sm text-green-600">+0.8%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
