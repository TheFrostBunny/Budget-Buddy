import * as XLSX from 'xlsx';
import React from 'react';
import { Download } from 'lucide-react';

interface ExportExcelButtonProps {
  data: any[];
  filename?: string;
  label?: string;
}

export const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
  data,
  filename = 'utgifter.xlsx',
  label = 'Eksporter til Excel',
}) => {
  const handleExport = () => {
    let exportData = data;
    try {
      const stored = localStorage.getItem('budgetbuddy_spending');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          exportData = parsed.transactions;
        }
      }
    } catch {}
    let budgetInfo = {};
    try {
      const budgetRaw = localStorage.getItem('budgetbuddy_budget');
      if (budgetRaw) {
        const budget = JSON.parse(budgetRaw);
        budgetInfo = {
          Budsjett: budget.amount,
          Type: budget.period,
          Startdato: budget.startDate ? new Date(budget.startDate).toLocaleString('nb-NO') : '',
        };
      }
    } catch {}
    const cleanData = [...exportData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((tx) => {
        let dato = '';
        if (tx.date) {
          const d =
            typeof tx.date === 'string' && tx.date.includes('T')
              ? new Date(tx.date)
              : new Date(Number(tx.date));
          dato = isNaN(d.getTime()) ? '' : d.toLocaleString('nb-NO');
        }
        return {
          Dato: dato,
          Beløp: tx.amount,
          Beskrivelse: tx.description || '',
          Butikk: tx.storeId || '',
        };
      });
    // Legg til budsjett-info som første rad
    const excelData = [budgetInfo, ...cleanData];
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Utgifter');
    XLSX.writeFile(wb, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="ml-2 rounded-full p-2 bg-primary text-white hover:bg-primary/80 flex items-center justify-center"
      aria-label={label}
      title={label}
    >
      <Download className="h-5 w-5" />
    </button>
  );
};
