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
import { TourProvider } from "@reactour/tour";
import Onboarding from "./components/Onboarding";

const queryClient = new QueryClient();

// Onboarding steps
const tourSteps = [
  {
    selector: '[data-tour="navigation"]',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Navigasjon</h3>
        <p>Dette er navigasjonsmenyen. Bruk den til å navigere mellom forskjellige sider i appen.</p>
      </div>
    ),
  },
  {
    selector: '[data-tour="budget"]',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Budsjett</h3>
        <p>Her kan du se og administrere budsjettet ditt. Hold oversikt over inntekter og utgifter.</p>
      </div>
    ),
  },
  {
    selector: '[data-tour="shopping"]',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Handleliste</h3>
        <p>Dette er handlelisten din. Legg til og fjern varer, og hold oversikt over hva du trenger å handle.</p>
      </div>
    ),
  },
];

const App = () => {
  const isMobile = useIsMobile();
  const checkedVersion = useRef(false);

  useEffect(() => {
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;
    if (!isMobile || checkedVersion.current || !isPWA) return;
    checkedVersion.current = true;
    fetch("/version.json")
      .then((res) => res.json())
      .then((data) => {
        const localVersion = localStorage.getItem("app_version") || "0.0.0";
        if (data.version !== localVersion) {
          toast({
            title: "Ny oppdatering tilgjengelig!",
            description:
              "Det finnes en nyere versjon av appen. Oppdater for å få siste funksjoner.",
            action: (
              <button
                onClick={() => {
                  localStorage.setItem("app_version", data.version);
                  window.location.reload();
                }}
                style={{
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 1rem",
                  fontWeight: "bold",
                  marginTop: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Oppdater
              </button>
            ),
          });
        } else {
          localStorage.setItem("app_version", data.version);
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
