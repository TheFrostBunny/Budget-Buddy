
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CURRENCIES = ["EUR", "USD", "NOK", "SEK", "GBP"];


export function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customRates, setCustomRates] = useState<{ [key: string]: number }>(() => {
    try {
      const saved = localStorage.getItem("customRates");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Oppdater customRates fra localStorage når valutapar endres
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("customRates");
      setCustomRates(saved ? JSON.parse(saved) : {});
    } catch {
      setCustomRates({});
    }
  }, [from, to]);
  const [showCustomRate, setShowCustomRate] = useState(false);
  const [customRate, setCustomRate] = useState("");

  const rateKey = `${from}_${to}`;

  const handleConvert = async () => {
    if (from === to) {
      setError("Velg to forskjellige valutaer.");
      setResult(null);
      return;
    }
    setLoading(true);
    setError("");
    if (!customRates[rateKey]) {
      setError("Du må legge inn egen valutakurs for dette valutaparet.");
      setLoading(false);
      setShowCustomRate(true);
      return;
    }
    setResult(amount * customRates[rateKey]);
    setLoading(false);
  };

  const handleSaveCustomRate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(customRate);
    if (!rate || rate <= 0) {
      setError("Skriv inn en gyldig kurs.");
      return;
    }
    const updated = { ...customRates, [rateKey]: rate };
    setCustomRates(updated);
    localStorage.setItem("customRates", JSON.stringify(updated));
    setShowCustomRate(false);
    setCustomRate("");
    setError("");
    setResult(amount * rate);
  };

  return (
    <Card className="overflow-hidden border-none bg-white/50 shadow-md ring-1 ring-border backdrop-blur-sm dark:bg-card/50">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-primary justify-between">
          <span className="flex items-center gap-2">
            💱 Valutakalkulator
          </span>
          <button
            type="button"
            aria-label={showCustomRate ? "Avbryt" : "Legg til egen valutakurs"}
            className={`rounded-full p-2 transition-colors ${showCustomRate ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
            onClick={() => setShowCustomRate((v) => !v)}
          >
            {showCustomRate ? (
              <span className="text-lg font-bold">×</span>
            ) : (
              <span className="text-lg font-bold">＋</span>
            )}
          </button>
        </CardTitle>
        <CardDescription className="text-muted-foreground">Konverter mellom ulike valutaer</CardDescription>
      </CardHeader>
      <form
        className="space-y-4 p-4 sm:space-y-6 sm:p-6"
        onSubmit={e => {
          e.preventDefault();
          handleConvert();
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Beløp og valuta</Label>
          <div className="flex flex-row items-end gap-2 w-full">
            <Input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="h-14 border-muted-foreground/20 pl-4 text-2xl font-bold focus-visible:ring-primary/30 sm:h-16 sm:text-3xl max-w-[120px]"
              step="any"
              required
            />
            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="from" className="sr-only">Fra</Label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger id="from" className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(cur => (
                    <SelectItem key={cur} value={cur}>{cur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <button
              type="button"
              aria-label="Bytt valutaer"
              className="mx-1 rounded-full bg-muted p-2 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary transition"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              <span className="text-xl">⇄</span>
            </button>
            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="to" className="sr-only">Til</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger id="to" className="h-12 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(cur => (
                    <SelectItem key={cur} value={cur}>{cur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading || from === to || !customRates[rateKey]}
          className="h-12 w-full text-lg font-medium transition-all duration-300"
        >
          {loading ? "Konverterer..." : "Konverter"}
        </Button>
        {!customRates[rateKey] && (
          <div className="text-sm text-yellow-700 dark:text-yellow-400 text-center mb-2">
            Du må legge inn egen valutakurs for å kunne konvertere.
          </div>
        )}

        {showCustomRate && (
          <form onSubmit={handleSaveCustomRate} className="flex flex-col gap-2 mt-2">
            <Label htmlFor="customRate">Egen valutakurs ({from} → {to})</Label>
            <Input
              id="customRate"
              type="number"
              step="any"
              min="0"
              value={customRate}
              onChange={e => setCustomRate(e.target.value)}
              placeholder="F.eks. 0.095"
              required
            />
            <Button type="submit" className="w-full">Lagre og bruk</Button>
          </form>
        )}
        {result !== null && (
          <div className="mt-2 text-green-700 dark:text-green-400 text-center">
            {amount} {from} = {result.toFixed(2)} {to}
            {customRates[rateKey] && (
              <div className="text-xs text-muted-foreground mt-1">(Egen kurs: {customRates[rateKey]})</div>
            )}
          </div>
        )}
        {error && <div className="mt-2 text-red-600 text-center">{error}</div>}
      </form>
    </Card>
  );
}
