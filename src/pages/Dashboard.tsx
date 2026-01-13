import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudget } from "@/hooks/useLocalStorage";

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
    <div className="space-y-6 p-4 pt-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Hamburg BudgetBuddy</h1>
        <p className="text-muted-foreground">Din smarte matbudsjett-app</p>
      </header>
        <Card>
          <CardHeader>
          </CardHeader>
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
              const timeStr = dateObj ? dateObj.toLocaleTimeString().slice(0,5) : "";
              return (
                <li key={tx.id} className="flex justify-between text-sm">
                  <span>{dateStr} {timeStr}</span>
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
      const isoDateTime = new Date(date + 'T' + time).toISOString();
      // Lagre utgift som negativt tall
      addSpending(-value, undefined, `Utgift lagt til: ${isoDateTime}`);
      setAmount("");
      setSuccess(true);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <section className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legg til utgift</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2 items-end">
            <Input
              type="number"
              min={0}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Utgift (kr)"
              className="w-32"
            />
            <Button onClick={handleAdd} disabled={!amount || parseFloat(amount) <= 0}>
              Legg til utgift
            </Button>
            {success && <span className="text-green-600 ml-2">Lagt til!</span>}
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-muted-foreground">Dato:</label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-36"
            />
            <label className="text-sm text-muted-foreground">Klokkeslett:</label>
            <Input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-24"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Dashboard;