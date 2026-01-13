import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBudget } from "@/components/budget-provider";
import { Wallet, Calendar, Clock, Plus, Check, TrendingUp, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";


const Dashboard = () => {
  const { t } = useTranslation();
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
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        </div>
      </header>
      <Card>
        <CardHeader></CardHeader>
        <CardContent className="space-y-4">
          <BudgetOverview />
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
  const { t } = useTranslation();
  
  if (!spending.transactions.length) return null;

  // Sorter transaksjoner nyest først
  const sortedTransactions = [...spending.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Grupper per dag
  const grouped: Record<string, typeof sortedTransactions> = {};
  sortedTransactions.forEach(tx => {
    const date = new Date(tx.date).toLocaleDateString("nb-NO", { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
    // Capitalize first letter
    const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);
    
    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(tx);
  });

  return (
    <section className="mt-8 space-y-6">
      <CardTitle className="text-xl px-1">{t('dashboard.history.title')}</CardTitle>
      
      {Object.entries(grouped).map(([date, transactions]) => (
        <div key={date}>
           <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">{date}</h3>
           <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {transactions.map((tx) => {
                  const dateObj = new Date(tx.date);
                  const timeStr = dateObj.toLocaleTimeString("nb-NO", { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <li key={tx.id} className="flex justify-between items-center p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{tx.description || t('dashboard.history.noDescription')}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {timeStr}
                        </span>
                      </div>
                      <span className="font-bold">{tx.amount.toFixed(0)} kr</span>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      ))}
    </section>
  );
};
const AddSpentAmount = () => {
  const { addSpending } = useBudget();
  const { t } = useTranslation();
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
      // Lagre utgift (addSpending legger til beløpet i totalen)
      addSpending(value, undefined, "Utgift");
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
            {t('dashboard.addExpense.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">
              {t('dashboard.addExpense.amount')}
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
                <Calendar className="w-3 h-3" /> {t('dashboard.addExpense.date')}
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
                <Clock className="w-3 h-3" /> {t('dashboard.addExpense.time')}
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
                <Check className="w-6 h-6" /> {t('dashboard.addExpense.saved')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-6 h-6" /> {t('dashboard.addExpense.add')}
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

const BudgetOverview = () => {
  const { budget, spending, savings, completePeriod } = useBudget();
  const { t } = useTranslation();

  if (!budget) return (
    <div className="text-center p-4 text-muted-foreground">
      {t('dashboard.noBudget')}
    </div>
  );

  const spent = spending.spent;
  const covered = spending.coveredBySavings || 0;
  // Effective spent is what we actually count against the budget limit.
  // Example: Budget 100. Spent 120. Covered 20. Effective = 100. Remaining = 0.
  const remaining = budget.amount - (spent - covered);
  const percentage = Math.min((spent / budget.amount) * 100, 100);
  const isOverBudget = remaining < 0;

  return (
    <section className="mb-6">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{t('dashboard.overview.remaining')}</p>
              <h2 className={`text-4xl font-bold ${isOverBudget ? "text-red-500" : "text-primary"}`}>
                {remaining.toFixed(0)} kr
              </h2>
            </div>
            <div className={`p-3 rounded-full ${isOverBudget ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-primary/20 text-primary"}`}>
              {isOverBudget ? <AlertCircle className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('dashboard.overview.spent')} <span className="font-medium text-foreground">{spent.toFixed(0)} kr</span></span>
              <span className="text-muted-foreground">{t('dashboard.overview.total')} <span className="font-medium text-foreground">{budget.amount} kr</span></span>
            </div>
            <Progress value={percentage} className={`h-2 ${isOverBudget ? "bg-red-100" : ""}`} indicatorClassName={isOverBudget ? "bg-red-500" : ""} />
            
            {savings > 0 && (
              <div className="mt-4 pt-4 border-t flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-medium text-muted-foreground">{t('dashboard.overview.savedTotal')}</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{savings.toFixed(0)} kr</span>
              </div>
            )}
            
            {remaining > 0 && (
              <div className="mt-2 text-center text-xs text-muted-foreground">
                {t('dashboard.overview.autoSaveInfo')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Dashboard;
