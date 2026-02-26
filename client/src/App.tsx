import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Proposals from "@/pages/proposals";
import Staking from "@/pages/staking";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard">
        {() => <Layout><Dashboard /></Layout>}
      </Route>
      <Route path="/proposals">
        {() => <Layout><Proposals /></Layout>}
      </Route>
      <Route path="/staking">
        {() => <Layout><Staking /></Layout>}
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
