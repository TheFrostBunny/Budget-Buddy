import React from 'react';
import { ChartPie } from 'lucide-react';
import BudgetAnalysisGraph from '@/components/budget/BudgetAnalysisGraph';

function BudgetAnalysisGraphTrigger() {
  const [showGraph, setShowGraph] = React.useState(false);
  return (
    <>
      <button
        aria-label="Vis budsjettanalyse-graf"
        className="rounded-full p-2 hover:bg-muted transition-colors ml-2"
        onClick={() => setShowGraph((v) => !v)}
      >
        <ChartPie className="h-6 w-6 text-primary" />
      </button>
      {showGraph && (
        <div className="mb-4">
          <BudgetAnalysisGraph />
        </div>
      )}
    </>
  );
}

export default BudgetAnalysisGraphTrigger;