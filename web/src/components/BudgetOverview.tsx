import React from 'react';
import { Category, Transaction } from '@/types';
import { Edit2, Plus } from 'lucide-react';

interface BudgetOverviewProps {
  transactions: Transaction[];
  categories: Category[];
  onEditCategory: (category: Category) => void;
}

export function BudgetOverview({ transactions, categories, onEditCategory }: BudgetOverviewProps) {
  // Hanya ambil kategori pengeluaran
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Budgeting & Realisasi</h3>
        <button 
          onClick={() => onEditCategory({} as Category)} // Empty object signals "New"
          className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
        >
          <Plus size={16} /> Kelola Kategori
        </button>
      </div>

      <div className="space-y-6">
        {expenseCategories.map(cat => {
          const spent = transactions
            .filter(t => t.category_id === cat.id)
            .reduce((sum, t) => sum + (t.total || 0), 0);
          
          const percentage = cat.budget_limit > 0 ? Math.min((spent / cat.budget_limit) * 100, 100) : 0;
          const isOverBudget = spent > cat.budget_limit && cat.budget_limit > 0;

          return (
            <div 
              key={cat.id} 
              onClick={() => onEditCategory(cat)}
              className="group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="font-medium text-gray-700">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                    Rp {spent.toLocaleString('id-ID')}
                  </span>
                  <span className="text-gray-400 text-sm"> / Rp {cat.budget_limit.toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget ? 'bg-red-500' : 
                    percentage > 80 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {isOverBudget && (
                <p className="text-xs text-red-500 mt-1 font-medium">⚠️ Over budget!</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
