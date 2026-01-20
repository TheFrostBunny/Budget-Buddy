import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BudgetCardProps {
  budget: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'daily';
}

export function BudgetCard({ budget, spent, period }: BudgetCardProps) {
  const remaining = budget - spent;
  const percentageSpent = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;
  const isNearLimit = percentageSpent > 80 && !isOverBudget;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>
            {period === 'weekly' ? 'Ukentlig' : period === 'monthly' ? 'Månedlig' : 'Hverdag'}{' '}
            budsjett
          </span>
          <span className="text-sm font-normal text-muted-foreground">€{budget.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress
            value={percentageSpent}
            className={cn(
              'h-3',
              isOverBudget && '[&>div]:bg-destructive',
              isNearLimit && '[&>div]:bg-warning',
            )}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Brukt: €{spent.toFixed(2)}</span>
            <span className={cn('font-medium', isOverBudget ? 'text-destructive' : 'text-success')}>
              {isOverBudget ? 'Over budsjett' : `Gjenstår: €${remaining.toFixed(2)}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
