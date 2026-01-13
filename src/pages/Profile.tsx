import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/hooks/useLocalStorage";
import { useBudget } from "@/components/budget-provider";
import { useEffect, useState } from "react";
import { DIETARY_LABELS, DietaryInfo } from "@/types";
import { User, Leaf, RotateCcw } from "lucide-react";

const Profile = () => {
  const { preferences, toggleDietaryPreference, setDefaultBudgetPeriod, setPreferencesState } = usePreferences();
  const { budget, setBudget, updateBudget, resetSpending, spending, completePeriod, resetSavingsBalance } = useBudget();

  const [rounds, setRounds] = useState<{ amount: number }[]>([]);
  const [money, setMoney] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  useEffect(() => {
    const storedRounds = localStorage.getItem("foodBudgetRounds");
    if (storedRounds) {
      setRounds(JSON.parse(storedRounds));
    }
    const storedMoney = localStorage.getItem("foodBudgetMoney");
    if (storedMoney) {
      const { money, duration } = JSON.parse(storedMoney);
      setMoney(money);
      setDuration(duration);
    } else {
      if (preferences.dailyBudgetAmount && preferences.dailyBudgetDays) {
        setMoney(preferences.dailyBudgetAmount);
        setDuration(preferences.dailyBudgetDays);
      }
    }
  }, [preferences.dailyBudgetAmount, preferences.dailyBudgetDays]);

  const dietaryOptions: DietaryInfo[] = ["vegetar", "vegan", "glutenfri", "laktosefri", "økologisk"];

  return (
    <div className="space-y-4 p-4 pt-6">
      <header className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profil</h1>
          <p className="text-muted-foreground">Tilpass dine preferanser</p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Leaf className="h-5 w-5" />
            Diettpreferanser
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {dietaryOptions.map((diet) => (
            <Badge
              key={diet}
              variant={preferences.dietaryPreferences.includes(diet) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDietaryPreference(diet)}
            >
              {DIETARY_LABELS[diet]}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Standard budsjettperiode</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 items-center">
          <Button
            variant={preferences.defaultBudgetPeriod === "weekly" ? "default" : "outline"}
            onClick={() => setDefaultBudgetPeriod("weekly")}
            className="flex-1"
          >
            Ukentlig
          </Button>
          <Button
            variant={preferences.defaultBudgetPeriod === "monthly" ? "default" : "outline"}
            onClick={() => setDefaultBudgetPeriod("monthly")}
            className="flex-1"
          >
            Månedlig
          </Button>
          <Button
            variant={preferences.defaultBudgetPeriod === "daily" ? "default" : "outline"}
            onClick={() => setDefaultBudgetPeriod("daily")}
            className="flex-1"
          >
            Hverdag
          </Button>
          {/* Flyttet input for antall dager ned til daglig matpenger */}
          <Button 
            variant="outline" 
            className="w-full mt-4 border-dashed text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (confirm("Dette vil avslutte dagen og flytte ubrukt beløp til sparing. Er du sikker?")) {
                completePeriod();
              }
            }}
          >
             Simuler "Ny Dag" (Spar ubrukt)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {preferences.defaultBudgetPeriod === "daily" 
              ? "Daglig matpenger (NOK)" 
              : preferences.defaultBudgetPeriod === "monthly" 
                ? "Månedlig budsjett (NOK)" 
                : "Ukentlig budsjett (NOK)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 items-start">
          <div className="flex gap-2 items-center w-full">
            <input
              type="number"
              min={0}
              value={preferences.dailyBudgetAmount ?? ""}
              onChange={e => {
                const amount = parseFloat(e.target.value);
                if (!isNaN(amount) && amount >= 0) {
                  setPreferencesState(prev => ({ ...prev, dailyBudgetAmount: amount }));
                }
              }}
              onBlur={() => {
                if (preferences.dailyBudgetAmount) {
                  updateBudget(preferences.dailyBudgetAmount, preferences.defaultBudgetPeriod || 'weekly');
                }
              }}
              placeholder={
                preferences.defaultBudgetPeriod === "daily" 
                  ? "Matpenger hver 24 timer (kr)" 
                  : "Beløp i kroner"
              }
              className="w-72 border rounded px-3 py-2 text-base"
            />
            {preferences.defaultBudgetPeriod === "daily" && (
              <input
                type="number"
                min={1}
                value={preferences.dailyBudgetDays ?? ""}
                onChange={e => {
                  const days = parseInt(e.target.value);
                  if (!isNaN(days) && days > 0) {
                    setPreferencesState(prev => ({ ...prev, dailyBudgetDays: days }));
                  }
                }}
                onBlur={() => {
                  if (preferences.dailyBudgetAmount) {
                    updateBudget(preferences.dailyBudgetAmount, preferences.defaultBudgetPeriod || 'weekly');
                  }
                }}
                placeholder="Antall dager"
                className="w-32 border rounded px-2 py-2 text-base"
                style={{ marginLeft: 8 }}
              />
            )}
          </div>
          {budget && (
            (() => {
              const totalAmount = budget.amount;
              const totalSpent = spending.spent;
              const unused = Math.max(totalAmount - totalSpent, 0);
              const percent = totalAmount > 0 ? (unused / totalAmount) * 100 : 0;
              return (
                <div className="text-sm text-muted-foreground mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-foreground mb-1">Status nåværende budsjett:</p>
                  <span>
                    Ubrukt: <b>{unused.toFixed(0)} kr</b> av {totalAmount} kr (<b>{percent.toFixed(1)}%</b> igjen)
                  </span>
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>

      {budget && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Handlinger</CardTitle>
          </CardHeader>
          <CardContent>
          <Button 
            variant="outline" 
            onClick={resetSpending} 
            className="w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Nullstill forbruk
          </Button>
          <Button 
             variant="ghost" 
             className="w-full mt-2 text-muted-foreground hover:text-destructive"
             onClick={() => {
                if (confirm("Er du sikker på at du vil slette oppspart beløp?")) {
                  resetSavingsBalance();
                }
             }}
          >
            Slett oppspart beløp
          </Button>
        </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;