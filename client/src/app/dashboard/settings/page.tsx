import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account and system settings',
};

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                defaultValue="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                defaultValue="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifs">Email Notifications</Label>
              <Switch id="emailNotifs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifs">Push Notifications</Label>
              <Switch id="pushNotifs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketAlerts">Market Alerts</Label>
              <Switch id="marketAlerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="tradingUpdates">Trading Updates</Label>
              <Switch id="tradingUpdates" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Trading Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultSize">Default Position Size</Label>
              <Input
                id="defaultSize"
                type="number"
                placeholder="Enter amount"
                defaultValue="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Default Stop Loss (%)</Label>
              <Input
                id="stopLoss"
                type="number"
                placeholder="Enter percentage"
                defaultValue="2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Default Take Profit (%)</Label>
              <Input
                id="takeProfit"
                type="number"
                placeholder="Enter percentage"
                defaultValue="6"
              />
            </div>
            <Button>Save Trading Settings</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mining Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pool">Mining Pool</Label>
              <Input
                id="pool"
                placeholder="Enter pool address"
                defaultValue="stratum+tcp://pool.example.com:3333"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="worker">Worker Name</Label>
              <Input
                id="worker"
                placeholder="Enter worker name"
                defaultValue="worker1"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoStart">Auto-start Mining</Label>
              <Switch id="autoStart" defaultChecked />
            </div>
            <Button>Save Mining Settings</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter API key"
                defaultValue="••••••••••••••••"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                placeholder="Enter API secret"
                defaultValue="••••••••••••••••"
                type="password"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="testnet">Use Testnet</Label>
              <Switch id="testnet" />
            </div>
            <Button>Save API Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
