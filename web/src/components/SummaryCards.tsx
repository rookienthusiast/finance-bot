import React from 'react';

interface SummaryProps {
  totalExpense: number;
  transactionCount: number;
}

export const SummaryCards: React.FC<SummaryProps> = ({ totalExpense, transactionCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium">Total Pengeluaran Bulan Ini</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          Rp {totalExpense.toLocaleString('id-ID')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium">Total Transaksi</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {transactionCount}
        </p>
      </div>
    </div>
  );
};
