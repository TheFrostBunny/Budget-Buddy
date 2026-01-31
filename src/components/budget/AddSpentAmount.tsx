import React, { useState, useEffect } from 'react';
import { useBudget } from '@/components/budget/budget-provider';
import { usePreferences } from '@/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, Calendar, Clock, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export interface AddSpentAmountProps {
  currency: string;
  convert: (amount: number) => number;
  betaEnabled: boolean;
}
const categories = [
  'Mat',
  'Transport',
  'Underholdning',
  'Helse',
  'Shopping',
  'Bolig',
  'Annet',
];
const AddSpentAmount: React.FC<AddSpentAmountProps> = React.memo(({ currency, convert, betaEnabled }) => {
  const { addSpending, budget } = useBudget();
  const { inputCurrency } = usePreferences();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [eurAmount, setEurAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [eurToNokRate, setEurToNokRate] = useState(() => {
    try {
      const saved = localStorage.getItem('customRates');
      if (saved) {
        const rates = JSON.parse(saved);
        if (rates['EUR_NOK']) return rates['EUR_NOK'];
      }
    } catch {}
    return 0;
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('customRates');
      if (saved) {
        const rates = JSON.parse(saved);
        if (rates['EUR_NOK']) setEurToNokRate(rates['EUR_NOK']);
      }
    } catch {}
  }, []);
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
      if (!budget) {
        return;
      }
      // Send kategori som både description og category
      addSpending(value, undefined, category, category);
      setAmount('');
      setEurAmount('');
      setSuccess(true);
      toast({
        title: 'Utgift lagret!',
        description: `Du har lagt til ${value} kr i kategorien "${category}".`,
      });
    }
  };
  useEffect(() => {
    if (eurAmount && eurToNokRate > 0) {
      const nok = parseFloat(eurAmount.replace(',', '.')) * eurToNokRate;
      if (!isNaN(nok)) setAmount(nok.toFixed(2));
    }
  }, [eurAmount, eurToNokRate]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <section className="mx-auto w-full max-w-md">
      <Card className="overflow-hidden border-none bg-white/50 shadow-md ring-1 ring-border backdrop-blur-sm dark:bg-card/50">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-primary">
            <Wallet className="h-5 w-5" />
            {t('dashboard.addExpense.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          {!budget && (
            <div className="p-4 text-center text-muted-foreground">
              {t('dashboard.noBudget', 'Du må opprette et budsjett før du kan legge til utgifter.')}
            </div>
          )}
          {budget && <>
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-muted-foreground">
              {t('dashboard.addExpense.amount')}
            </label>
            {inputCurrency === 'NOK' && (
              <div className="relative mb-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                  kr
                </span>
                <Input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="h-14 border-muted-foreground/20 pl-12 text-2xl font-bold focus-visible:ring-primary/30 sm:h-16 sm:text-3xl"
                />
              </div>
            )}
            {inputCurrency === 'EUR' && betaEnabled && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted-foreground">
                  €
                </span>
                <Input
                  type="number"
                  min={0}
                  value={eurAmount}
                  onChange={e => setEurAmount(e.target.value)}
                  placeholder="F.eks. 10 for å legge til 10 euro"
                  className="h-10 border-muted-foreground/20 pl-10 text-base font-medium focus-visible:ring-primary/30 sm:h-12 sm:text-lg"
                  step="any"
                  aria-label="Legg til i euro, blir automatisk NOK"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {eurToNokRate > 0
                    ? `Bruker kurs: 1 € = ${eurToNokRate} kr`
                    : 'Sett valutakurs i valutakalkulatoren'}
                </span>
                {eurAmount === '' && (
                  <div className="text-xs text-red-600 mt-1">
                    Skriv inn euro-beløp for å konvertere til norske kroner.
                  </div>
                )}
              </div>
            )}
            {inputCurrency === 'EUR' && !betaEnabled && (
              <div className="text-xs text-yellow-700 mt-1">
                Euro-funksjonen er i beta. Aktiver beta-funksjoner i innstillinger for å bruke denne.
              </div>
            )}
            {inputCurrency === 'OTHER' && (
              <ul className="list-disc pl-6 text-xs text-muted-foreground mt-1">
                <li>Du har valgt "Annet" som valuta i profilen.</li>
                <li>Utgiftsregistrering i andre valutaer enn NOK og EUR støttes ikke ennå.</li>
                <li>Bytt til NOK eller EUR i profilen for å legge inn utgifter.</li>
                <li>Støtte for flere valutaer kommer i en fremtidig oppdatering.</li>
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="ml-1 text-xs font-medium text-muted-foreground">Kategori</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-2 text-base text-foreground"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3 w-3" /> {t('dashboard.addExpense.date')}
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3 w-3" /> {t('dashboard.addExpense.time')}
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
            className={`h-12 w-full text-lg font-medium transition-all duration-300 ${
              success ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {success ? (
              <span className="flex items-center gap-2">
                <Check className="h-6 w-6" /> {t('dashboard.addExpense.saved')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-6 w-6" /> {t('dashboard.addExpense.add')}
              </span>
            )}
          </Button>
          </>}
        </CardContent>
      </Card>
    </section>
  );
});
export default AddSpentAmount;
