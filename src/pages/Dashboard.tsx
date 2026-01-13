import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudget } from "@/hooks/useLocalStorage";
import { Wallet, Calendar, Clock, Plus, Check } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

// Komponent for å legge til utgift

const Dashboard = () => {
  const { budget, spending, setBudget } = useBudget();
  const [budgetInput, setBudgetInput] = useState("");

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      setBudget(amount, "weekly");
      setBudgetInput("");
    }
  };

  return (
    <div className="space-y-6 sm:p-4 p-2 pt-4 sm:pt-6">
      <header className="flex justify-between items-center bg-card rounded-xl p-4 shadow-sm border mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Hamburg BudgetBuddy</h1>
          <p className="text-muted-foreground">Din smarte matbudsjett-app</p>
        </div>
        <ModeToggle />
      </header>
      <Card>
        <CardHeader></CardHeader>
        <CardContent className="space-y-4">
          <AddSpentAmount />
          <ExpenseHistory />
        </CardContent>
      </Card>
    </div>
  );
};

// Komponent for å vise utgiftshistorikk
const ExpenseHistory = () => {
  const { spending } = useBudget();
  if (!spending.transactions.length) return null;
  return (
    <section className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Utgiftshistorikk</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {spending.transactions.map((tx) => {
              const dateObj = tx.date ? new Date(tx.date) : null;
              const dateStr = dateObj ? dateObj.toLocaleDateString() : "";
              const timeStr = dateObj
                ? dateObj.toLocaleTimeString().slice(0, 5)
                : "";
              return (
                <li key={tx.id} className="flex justify-between text-sm">
                  <span>
                    {dateStr} {timeStr}
                  </span>
                  <span>{tx.amount.toFixed(2)} kr</span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
};
const AddSpentAmount = () => {
  const { addSpending } = useBudget();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0 && date && time) {
      // Kombiner dato og tid til ISO-string
      const isoDateTime = new Date(date + "T" + time).toISOString();
      // Lagre utgift som negativt tall
      addSpending(-value, undefined, `Utgift lagt til: ${isoDateTime}`);
      setAmount("");
      setSuccess(true);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <section className="max-w-md mx-auto w-full">
      <Card className="border-none shadow-md bg-white/50 dark:bg-card/50 backdrop-blur-sm overflow-hidden ring-1 ring-border">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-primary">
            <Wallet className="w-5 h-5" />
            Registrer utgift
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              Beløp
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                kr
              </span>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="pl-12 h-14 sm:h-16 text-2xl sm:text-3xl font-bold border-muted-foreground/20 focus-visible:ring-primary/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Dato
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Tid
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="font-medium"
              />
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!amount || parseFloat(amount) <= 0}
            className={`w-full h-12 text-lg font-medium transition-all duration-300 ${
              success
                ? "bg-green-600 hover:bg-green-700"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {success ? (
              <span className="flex items-center gap-2">
                <Check className="w-6 h-6" /> Lagret!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-6 h-6" /> Legg til utgift
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Dashboard;
