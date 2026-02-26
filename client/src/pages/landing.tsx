import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/connect-wallet";
import { motion } from "framer-motion";
import { Waves, ArrowRight, ShieldAlert, Cpu, Layers } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-white">StackWave</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-white/90">
                Launch App <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 relative z-10 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center mt-12 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Platform Beta v1.0 Live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 leading-tight">
              The Operating System for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
                Tokenized Economies
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              AI-powered governance, intelligent staking, and predictive analytics for the next generation of DAOs and protocols.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 border-0">
                    Enter Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="h-14 px-1 [&_button]:h-full [&_button]:text-lg [&_button]:px-8">
                  <ConnectWallet />
                </div>
              )}
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg glass-panel glow-border border-primary/30 text-white">
                Read Whitepaper
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-8 rounded-3xl glow-border"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">AI Risk Analytics</h3>
            <p className="text-muted-foreground">Monitor wallet cluster behaviors and predict governance attacks before they happen.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel p-8 rounded-3xl glow-border"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">Liquid Staking</h3>
            <p className="text-muted-foreground">Deposit SWAVE tokens securely. View real-time APY metrics driven by protocol revenue.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel p-8 rounded-3xl glow-border"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">Smart Proposals</h3>
            <p className="text-muted-foreground">Create and vote on DAO proposals using token-weighted mechanics on-chain.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
