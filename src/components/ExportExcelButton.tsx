import * as XLSX from "xlsx";
import React from "react";

interface ExportExcelButtonProps {
  data: any[];
  filename?: string;
  label?: string;
}

export const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({
  data,
  filename = "utgifter.xlsx",
  label = "Eksporter til Excel",
}) => {
  const handleExport = () => {
    // Hent data fra localStorage hvis tilgjengelig
    let exportData = data;
    try {
      const stored = localStorage.getItem("budgetbuddy_spending");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          exportData = parsed.transactions;
        }
      }
    } catch {}
    // Hent budsjett-info fra localStorage
    let budgetInfo = {};
    try {
      const budgetRaw = localStorage.getItem("budgetbuddy_budget");
      if (budgetRaw) {
        const budget = JSON.parse(budgetRaw);
        budgetInfo = {
          Budsjett: budget.amount,
          Type: budget.period,
          Startdato: budget.startDate ? new Date(budget.startDate).toLocaleString("nb-NO") : ""
        };
      }
    } catch {}
    const cleanData = [...exportData]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(tx => {
        let dato = "";
        if (tx.date) {
          const d = typeof tx.date === "string" && tx.date.includes("T") ? new Date(tx.date) : new Date(Number(tx.date));
          dato = isNaN(d.getTime()) ? "" : d.toLocaleString("nb-NO");
        }
        return {
          Dato: dato,
          Beløp: tx.amount,
          Beskrivelse: tx.description || "",
          Butikk: tx.storeId || ""
        };
      });
    // Legg til budsjett-info som første rad
    const excelData = [budgetInfo, ...cleanData];
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Utgifter");
    XLSX.writeFile(wb, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="ml-2 rounded bg-primary px-3 py-1 text-white text-sm font-medium hover:bg-primary/80"
    >
      {label}
    </button>
  );
};
