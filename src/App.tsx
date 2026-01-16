import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { BudgetProvider } from "@/components/budget-provider";
import ShoppingList from "./pages/ShoppingList";
import Stores from "./pages/Stores";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient();

const App = () => {
  const isMobile = useIsMobile();
  const checkedVersion = useRef(false);

  useEffect(() => {
    if (!isMobile || checkedVersion.current) return;
    checkedVersion.current = true;
    fetch("/version.json")
      .then((res) => res.json())
      .then((data) => {
        const currentVersion = "0.0.0";
        if (data.version !== currentVersion) {
          toast({
            title: "Ny oppdatering tilgjengelig!",
            description:
              "Det finnes en nyere versjon av appen. Oppdater for å få siste funksjoner.",
          });
        }
      })
      .catch(() => {});
  }, [isMobile]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BudgetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/shopping-list" element={<ShoppingList />} />
                  <Route path="/stores" element={<Stores />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </BudgetProvider>
    </ThemeProvider>
  );
};

export default App;
