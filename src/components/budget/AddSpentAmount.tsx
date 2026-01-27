import { useState, useEffect } from 'react';
import { useBudget } from '@/components/budget/budget-provider';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, Calendar, Clock, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const AddSpentAmount = ({ currency, convert }) => {
  const { addSpending, budget } = useBudget();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
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
      addSpending(value, undefined, 'Utgift');
      setAmount('');
      setSuccess(true);
      toast({
        title: 'Utgift lagret!',
        description: `Du har lagt til ${value} kr.`,
      });
    }
  };

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
                className="h-14 border-muted-foreground/20 pl-12 text-2xl font-bold focus-visible:ring-primary/30 sm:h-16 sm:text-3xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
};

export default AddSpentAmount;
