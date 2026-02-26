import { useState } from "react";
import { motion } from "framer-motion";
import { useStaking, useStake } from "@/hooks/use-staking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, TrendingUp, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function Staking() {
  const { data: stakingData, isLoading } = useStaking();
  const { mutateAsync: stake, isPending } = useStake();
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid positive number.", variant: "destructive" });
      return;
    }

    try {
      await stake(amount);
      setAmount("");
      toast({ title: "Stake Successful", description: `Successfully staked ${amount} SWAVE.` });
    } catch (err) {
      toast({ title: "Staking Failed", description: "Could not process transaction.", variant: "destructive" });
    }
  };

  const totalStaked = stakingData?.totalStaked || "0";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-glow">Liquid Staking</h1>
        <p className="text-muted-foreground mt-2">Secure the network and earn protocol yields.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-panel border-primary/20 relative overflow-hidden">
            <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-primary/20 blur-[60px] rounded-full" />
            <CardHeader>
              <CardTitle className="font-display">Stake SWAVE</CardTitle>
              <CardDescription>Lock your tokens to participate in governance and earn APY.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStake} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="amount">Amount to Stake</Label>
                    <span className="text-xs text-muted-foreground">Available: 10,000 SWAVE (Mock)</span>
                  </div>
                  <div className="relative">
                    <Input 
                      id="amount" 
                      type="number" 
                      step="0.01"
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-background/50 h-14 text-lg pl-12 border-primary/30 focus-visible:ring-primary"
                    />
                    <Coins className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs h-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => setAmount("10000")}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Annual Yield</span>
                    <span className="text-green-400 font-medium">12.5% APY</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lock-up Period</span>
                    <span className="text-foreground font-medium">None (Liquid)</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending} 
                  className="w-full h-14 text-lg bg-gradient-to-r from-primary to-secondary text-white border-0 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
                  Confirm Stake
                </Button>
              </form>
            </CardContent>
          </Card>

          {stakingData?.stakes && stakingData.stakes.length > 0 && (
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Recent Deposits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stakingData.stakes.slice(0, 5).map((stake) => (
                    <div key={stake.id} className="flex justify-between items-center p-3 rounded-lg bg-background/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-secondary rotate-45" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Staked SWAVE</p>
                          <p className="text-xs text-muted-foreground">ID: #{stake.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">{Number(stake.amount).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-panel bg-gradient-to-b from-card to-background">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Your Active Stake</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-glow">{Number(totalStaked).toLocaleString()}</span>
                  <span className="text-muted-foreground font-medium">SWAVE</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <div className="w-full bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Earning Rewards</p>
                  <p className="text-sm font-medium text-green-400">Active</p>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="glass-panel">
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-4">
                <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Audited Contracts</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Smart contracts have been fully audited by leading security firms.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Coins className="w-6 h-6 text-secondary flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium mb-1">Auto-compounding</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Rewards are automatically compounded into your active stake position.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
