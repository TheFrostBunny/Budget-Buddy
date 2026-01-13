import React, { useState, useEffect } from "react";
import { BudgetCard } from "./BudgetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface Round {
  id: number;
  amount: number;
  date: string;
}

const LOCAL_STORAGE_KEY = "foodBudgetRounds";
const MONEY_STORAGE_KEY = "foodBudgetMoney";

export function BudgetRounds() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [input, setInput] = useState("");
  const [moneyInput, setMoneyInput] = useState("");
  const [durationInput, setDurationInput] = useState("");
  const [money, setMoney] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const storedRounds = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedRounds) {
      setRounds(JSON.parse(storedRounds));
    }
    const storedMoney = localStorage.getItem(MONEY_STORAGE_KEY);
    if (storedMoney) {
      const { money, duration } = JSON.parse(storedMoney);
      setMoney(money);
      setDuration(duration);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rounds));
  }, [rounds]);

  useEffect(() => {
    localStorage.setItem(MONEY_STORAGE_KEY, JSON.stringify({ money, duration }));
  }, [money, duration]);

  function addRound() {
    const amount = parseFloat(input);
    if (!isNaN(amount) && amount > 0) {
      setRounds([...rounds, { id: Date.now(), amount, date: new Date().toLocaleDateString() }]);
      setInput("");
    }
  }

  function saveMoneyInfo() {
    const m = parseFloat(moneyInput);
    const d = parseInt(durationInput);
    if (!isNaN(m) && m > 0 && !isNaN(d) && d > 0) {
      setMoney(m);
      setDuration(d);
      setMoneyInput("");
      setDurationInput("");
    }
  }

  const totalSpent = rounds.reduce((sum, r) => sum + r.amount, 0);

  // Kalkuler ubrukte penger per runde
  const unusedData = rounds.map((round, idx) => {
    if (!money) return { name: `Runde ${idx + 1}`, unused: 0 };
    const unused = Math.max(money - round.amount, 0);
    return { name: `Runde ${idx + 1}`, unused };
  });

  // Farger for kakediagram
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28BFE",
    "#FF6699",
    "#33CC99",
    "#FF6666",
  ];

  return (
    <div className="space-y-6">
      {/* Fjernet ekstra BudgetCard for å unngå duplikat */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Beløp brukt denne runden (€)"
        />
        <Button onClick={addRound}>Legg til</Button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Input
          type="number"
          value={moneyInput}
          onChange={(e) => setMoneyInput(e.target.value)}
          placeholder="Matpenger mottatt (€)"
        />
        <Input
          type="number"
          value={durationInput}
          onChange={(e) => setDurationInput(e.target.value)}
          placeholder="Antall runder / uker"
        />
        <Button onClick={saveMoneyInfo}>Lagre</Button>
      </div>
      {money && duration && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span>
            Mottatt matpenger: <b>€{money.toFixed(2)}</b> hver gang, i <b>{duration}</b> runder
          </span>
        </div>
      )}
      {/* PieChart for ubrukte penger per runde */}
      {unusedData.length > 0 && money && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="mb-2 font-semibold">Ubrukte penger per runde</h3>
          <PieChart width={320} height={220}>
            <Pie
              data={unusedData}
              dataKey="unused"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {unusedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </div>
      )}
      <div className="mt-4">
        <h3 className="mb-2 font-semibold">Historikk</h3>
        <ul className="space-y-1">
          {rounds.map((round) => (
            <li key={round.id} className="flex justify-between text-sm">
              <span>{round.date}</span>
              <span>€{round.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
