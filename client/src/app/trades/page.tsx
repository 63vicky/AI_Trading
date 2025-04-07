'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { NewTradeDialog } from '@/components/trades/NewTradeDialog';
import { TradeStats } from '@/components/trades/TradeStats';

interface Trade {
  _id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  entryTime: string;
  exitTime?: string;
  profitLoss?: number;
  profitLossPercentage?: number;
}

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isNewTradeDialogOpen, setIsNewTradeDialogOpen] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades');
      const data = await response.json();
      setTrades(data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trades</h1>
        <Button onClick={() => setIsNewTradeDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Trade
        </Button>
      </div>

      <TradeStats />

      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade._id}>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>
                    {trade.type === 'LONG' ? (
                      <ArrowUpRight className="text-green-500" />
                    ) : (
                      <ArrowDownRight className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                  <TableCell>
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                  </TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        trade.status === 'OPEN'
                          ? 'bg-yellow-100 text-yellow-800'
                          : trade.status === 'CLOSED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {trade.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(trade.entryTime), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {trade.exitTime
                      ? format(new Date(trade.exitTime), 'MMM d, yyyy HH:mm')
                      : '-'}
                  </TableCell>
                  <TableCell
                    className={
                      trade.profitLoss
                        ? trade.profitLoss >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                        : ''
                    }
                  >
                    {trade.profitLoss
                      ? `${formatCurrency(
                          trade.profitLoss
                        )} (${formatPercentage(
                          trade.profitLossPercentage || 0
                        )})`
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewTradeDialog
        open={isNewTradeDialogOpen}
        onOpenChange={setIsNewTradeDialogOpen}
        onTradeCreated={fetchTrades}
      />
    </div>
  );
}
