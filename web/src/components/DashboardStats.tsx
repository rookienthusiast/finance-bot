import React from 'react';
import { Category, Transaction } from '@/types';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface DashboardStatsProps {
  transactions: Transaction[];
  categories: Category[];
}

export function DashboardStats({ transactions, categories }: DashboardStatsProps) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.total || 0), 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.total || 0), 0);

  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Wallet size={24} className="text-white" />
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Sisa Saldo</p>
            <h3 className="text-2xl font-bold">
              Rp {balance.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>
        <div className="text-sm text-blue-100 bg-blue-800/30 px-3 py-1.5 rounded-lg inline-block">
          {balance >= 0 ? 'Keuangan Sehat 👍' : 'Defisit! ⚠️'}
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl">
            <ArrowDownCircle size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Pemasukan</p>
            <h3 className="text-2xl font-bold text-gray-900">
              Rp {income.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-xl">
            <ArrowUpCircle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Pengeluaran</p>
            <h3 className="text-2xl font-bold text-gray-900">
              Rp {expense.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
