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
    let budgetInfo = {};
    try {
      const stored = localStorage.getItem('budgetbuddy_spending');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          exportData = parsed.transactions;
        }
      }
    } catch {}
    try {
      const budgetRaw = localStorage.getItem('budgetbuddy_budget');
      if (budgetRaw) {
        const budget = JSON.parse(budgetRaw);
        budgetInfo = {
          'Budsjettbeløp': budget.amount,
          'Periode': budget.period === 'weekly' ? 'Uke' : budget.period === 'monthly' ? 'Måned' : 'Dag',
          'Startdato': budget.startDate ? new Date(budget.startDate).toLocaleString('nb-NO') : '',
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
          'Dato': dato,
          'Beløp (kr)': tx.amount,
          'Beskrivelse': tx.description || '',
          'Butikk': tx.storeId || '',
          'Kategori': tx.category || '',
        };
      });
    const wb = XLSX.utils.book_new();
    // Budsjett-info på eget ark
    const wsBudget = XLSX.utils.json_to_sheet([budgetInfo]);
    XLSX.utils.book_append_sheet(wb, wsBudget, 'Budsjett');
    // Transaksjoner på eget ark
    const wsTrans = XLSX.utils.json_to_sheet(cleanData);
    XLSX.utils.book_append_sheet(wb, wsTrans, 'Utgifter');
    XLSX.writeFile(wb, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="ml-2 rounded-full px-4 py-2 bg-primary text-white hover:bg-primary/80 flex items-center gap-2 justify-center"
      aria-label={label}
      title={label}
    >
      <Download className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
