import { useState } from "react";
import { motion } from "framer-motion";
import { useProposals, useCreateProposal, useCastVote, useVotes } from "@/hooks/use-proposals";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, ThumbsUp, ThumbsDown, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const createSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be detailed enough"),
});

export default function Proposals() {
  const { data: proposals, isLoading } = useProposals();
  const { mutateAsync: createProposal, isPending: isCreating } = useCreateProposal();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { title: "", description: "" }
  });

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    try {
      await createProposal(values);
      setOpen(false);
      form.reset();
      toast({ title: "Proposal Created", description: "Your proposal is now live for voting." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to create proposal", variant: "destructive" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Governance</h1>
          <p className="text-muted-foreground">Shape the future of StackWave by voting on active proposals.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <FileText className="w-4 h-4 mr-2" /> New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-primary/20 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Create Proposal</DialogTitle>
              <DialogDescription>Submit a new governance proposal for community vote.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proposal Title</Label>
                <Input 
                  id="title" 
                  {...form.register("title")} 
                  className="bg-background/50 border-border"
                  placeholder="e.g. Increase Staking Rewards by 2%"
                />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  {...form.register("description")} 
                  className="bg-background/50 border-border min-h-[120px]"
                  placeholder="Explain the rationale behind this proposal..."
                />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
              </div>
              <Button type="submit" disabled={isCreating} className="w-full bg-primary hover:bg-primary/90 text-white">
                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Proposal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Card key={i} className="glass-panel h-[200px]"><Skeleton className="h-full w-full bg-transparent" /></Card>)
        ) : proposals?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground glass-panel rounded-xl">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No proposals found. Be the first to create one!</p>
          </div>
        ) : (
          proposals?.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        )}
      </div>
    </motion.div>
  );
}

function ProposalCard({ proposal }: { proposal: any }) {
  const { data: votes } = useVotes(proposal.id);
  const { mutateAsync: castVote, isPending } = useCastVote();
  const { toast } = useToast();

  const handleVote = async (support: boolean) => {
    try {
      // Mocking token weight randomly between 100 and 5000 for demo
      const randomWeight = (Math.floor(Math.random() * 4900) + 100).toString();
      await castVote({ proposalId: proposal.id, support, weight: randomWeight });
      toast({ title: "Vote Cast Successfully", description: `You voted ${support ? 'FOR' : 'AGAINST'} with ${randomWeight} SWAVE.` });
    } catch (e) {
      toast({ title: "Vote Failed", description: "Could not cast vote.", variant: "destructive" });
    }
  };

  // Calculate vote totals
  const totalFor = votes?.filter(v => v.support).reduce((acc, v) => acc + parseFloat(v.weight), 0) || 0;
  const totalAgainst = votes?.filter(v => !v.support).reduce((acc, v) => acc + parseFloat(v.weight), 0) || 0;
  const total = totalFor + totalAgainst;
  const percentFor = total > 0 ? (totalFor / total) * 100 : 0;
  const percentAgainst = total > 0 ? (totalAgainst / total) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/20 text-primary border-primary/30';
      case 'executed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'defeated': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-3 h-3 mr-1" />;
      case 'executed': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case 'defeated': return <XCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <Card className="glass-panel flex flex-col hover:border-primary/30 transition-colors duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={`uppercase tracking-wider font-mono text-[10px] ${getStatusColor(proposal.status)}`}>
            {getStatusIcon(proposal.status)} {proposal.status}
          </Badge>
          <span className="text-xs text-muted-foreground">ID: #{proposal.id}</span>
        </div>
        <CardTitle className="font-display text-xl line-clamp-1">{proposal.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm mt-2">
          {proposal.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-green-400">For: {totalFor.toLocaleString()}</span>
              <span className="text-destructive">Against: {totalAgainst.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-background border overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: `${percentFor}%` }} />
              <div className="h-full bg-destructive" style={{ width: `${percentAgainst}%` }} />
            </div>
          </div>
        </div>
      </CardContent>

      {proposal.status === 'active' && (
        <CardFooter className="gap-2 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            className="flex-1 bg-green-500/5 hover:bg-green-500/10 border-green-500/20 text-green-400 hover:text-green-300"
            disabled={isPending}
            onClick={() => handleVote(true)}
          >
            <ThumbsUp className="w-4 h-4 mr-2" /> For
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 bg-destructive/5 hover:bg-destructive/10 border-destructive/20 text-destructive hover:text-destructive-foreground"
            disabled={isPending}
            onClick={() => handleVote(false)}
          >
            <ThumbsDown className="w-4 h-4 mr-2" /> Against
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
