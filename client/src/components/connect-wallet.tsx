import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Wallet, Loader2, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function ConnectWallet() {
  const { user, login, logout, isLoggingIn } = useAuth();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      // Generate a realistic looking mock wallet address for demo
      const randomHex = Math.floor(Math.random()*16777215).toString(16);
      const mockAddress = `0x${randomHex.padEnd(40, '0')}`;
      
      await login(mockAddress);
      toast({
        title: "Wallet Connected",
        description: "Successfully authenticated via SIWE.",
      });
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-mono glass-panel glow-border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass-panel border-primary/20">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem 
            className="text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isLoggingIn}
      className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300"
    >
      {isLoggingIn ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="mr-2 h-4 w-4" />
      )}
      Connect Wallet
    </Button>
  );
}
