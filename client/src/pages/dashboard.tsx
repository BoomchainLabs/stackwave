import { motion } from "framer-motion";
import { useAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, Users, Zap, AlertTriangle } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Mock chart data for visual polish
const mockChartData = [
  { name: "Mon", value: 4000, staked: 2400 },
  { name: "Tue", value: 3000, staked: 1398 },
  { name: "Wed", value: 5000, staked: 9800 },
  { name: "Thu", value: 2780, staked: 3908 },
  { name: "Fri", value: 8890, staked: 4800 },
  { name: "Sat", value: 2390, staked: 3800 },
  { name: "Sun", value: 3490, staked: 4300 },
];

export default function Dashboard() {
  const { data: analytics, isLoading, error } = useAnalytics();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold">Platform Overview</h1>
        <p className="text-muted-foreground">AI-driven insights and network statistics.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-card" />)}
        </div>
      ) : error ? (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex items-center gap-4">
            <AlertTriangle className="text-destructive w-8 h-8" />
            <div>
              <h3 className="font-bold text-destructive">Failed to load analytics</h3>
              <p className="text-sm text-destructive/80">The analytics service is currently unavailable.</p>
            </div>
          </CardContent>
        </Card>
      ) : analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-panel overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Risk Score</CardTitle>
              <ShieldCheck className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{analytics.riskScore}/100</div>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Safe cluster detected
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gov Engagement</CardTitle>
              <Users className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{analytics.governanceEngagement}%</div>
              <p className="text-xs text-muted-foreground mt-1">Active voting participation</p>
            </CardContent>
          </Card>

          <Card className="glass-panel overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-bl-full pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Token Velocity</CardTitle>
              <Zap className="w-4 h-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{analytics.tokenVelocity.toFixed(2)}v</div>
              <p className="text-xs text-muted-foreground mt-1">SWAVE movement rate</p>
            </CardContent>
          </Card>

          <Card className="glass-panel overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Behavior Cluster</CardTitle>
              <Activity className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold font-display uppercase tracking-wider text-blue-400">{analytics.walletCluster}</div>
              <p className="text-xs text-muted-foreground mt-2">AI-categorized segment</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Network TVL & Staking Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStaked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="monotone" dataKey="staked" stroke="hsl(var(--secondary))" strokeWidth={2} fillOpacity={1} fill="url(#colorStaked)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Recent System Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { title: "New Proposal Created", time: "10 mins ago", color: "text-primary" },
              { title: "Large Stake Deposit", time: "2 hours ago", color: "text-secondary" },
              { title: "Risk Model Updated", time: "5 hours ago", color: "text-pink-500" },
              { title: "Proposal #12 Executed", time: "1 day ago", color: "text-green-500" },
            ].map((event, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 3 && <div className="absolute top-6 left-2 bottom-[-24px] w-px bg-border z-0" />}
                <div className={`w-4 h-4 rounded-full bg-background border-2 z-10 flex-shrink-0 mt-1 border-current ${event.color}`} />
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
