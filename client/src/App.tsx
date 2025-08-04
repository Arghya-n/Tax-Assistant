import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Chat from "@/pages/chat";
import Register from "@/pages/register";
import Login from "@/pages/login";
import InvestmentAdvisor from "@/pages/investment-advisor";
import TaxFormWizard from "@/pages/tax-form-wizard";
import HumanAgent from "@/pages/human-agent";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Chat} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/investment-advisor" component={InvestmentAdvisor} />
      <Route path="/tax-form-wizard" component={TaxFormWizard} />
      <Route path="/human-agent" component={HumanAgent} />
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
