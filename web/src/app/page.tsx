'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Transaction, Category, TransactionItem } from '@/types';
import { DashboardStats } from '@/components/DashboardStats';
import { BudgetOverview } from '@/components/BudgetOverview';
import { TransactionList } from '@/components/TransactionList';
import { TransactionModal } from '@/components/TransactionModal';
import { CategoryModal } from '@/components/CategoryModal';
import { TransactionDetailModal } from '@/components/TransactionDetailModal';
import { Plus, Filter, Download } from 'lucide-react';

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);

  // User State
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  const fetchUser = async () => {
    // Ambil user pertama yang ada di database (Asumsi Single User)
    const { data } = await supabase.from('users').select('id').limit(1).single();
    if (data) {
      setUserId(data.id);
    } else {
      console.warn('Belum ada user di database. Pastikan bot sudah dijalankan minimal sekali.');
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select('*, items:transaction_items(*)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  const handleSaveTransaction = async (formData: Partial<Transaction>, items: Partial<TransactionItem>[]) => {
    try {
      let transactionId = editingTransaction?.id;

      if (transactionId) {
        // Update Main Transaction
        const { error } = await supabase
          .from('transactions')
          .update({
            date: formData.date,
            store: formData.store,
            total: formData.total,
            type: formData.type,
            category_id: formData.category_id || null,
          })
          .eq('id', transactionId);
        
        if (error) throw error;

        // Delete existing items to replace with new ones (Simpler approach)
        await supabase.from('transaction_items').delete().eq('transaction_id', transactionId);

      } else {
        // Create New Transaction
        if (!userId) {
          alert('Error: User ID tidak ditemukan. Pastikan bot sudah pernah dijalankan.');
          return;
        }

        const { data, error } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            date: formData.date,
            store: formData.store,
            total: formData.total,
            type: formData.type,
            category_id: formData.category_id || null,
          })
          .select()
          .single();
        
        if (error) throw error;
        transactionId = data.id;
      }

      // Insert Items
      if (items.length > 0 && transactionId) {
        const itemsToInsert = items.map(item => ({
          transaction_id: transactionId,
          name: item.name || 'Item',
          qty: item.qty || 1,
          price: item.price || 0,
          subtotal: (item.qty || 1) * (item.price || 0),
        }));

        const { error: itemsError } = await supabase
          .from('transaction_items')
          .insert(itemsToInsert);
        
        if (itemsError) throw itemsError;
      }

      fetchTransactions();
      setIsModalOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Gagal menyimpan data!');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;

    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      alert('Gagal menghapus!');
    } else {
      fetchTransactions();
    }
  };

  // Category Handlers
  const handleSaveCategory = async (formData: Partial<Category>) => {
    try {
      if (editingCategory && editingCategory.id) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update(formData)
          .eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('categories')
          .insert(formData);
        if (error) throw error;
      }
      fetchCategories();
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Gagal menyimpan kategori!');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Gagal menghapus kategori! Pastikan tidak ada transaksi yang menggunakan kategori ini.');
    }
  };

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const openViewModal = (t: Transaction) => {
    setViewingTransaction(t);
    setIsDetailModalOpen(true);
  };

  const openCategoryModal = (c: Category) => {
    if (c.id) {
      setEditingCategory(c);
    } else {
      setEditingCategory(null); // New
    }
    setIsCategoryModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Dashboard</h1>
            <p className="text-gray-500 mt-1">Kelola arus kas dan budget bulananmu.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              <select 
                value={month} 
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-transparent text-gray-700 py-1 px-3 text-sm font-medium focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                ))}
              </select>
              <div className="w-px bg-gray-200 my-1"></div>
              <select 
                value={year} 
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent text-gray-700 py-1 px-3 text-sm font-medium focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Plus size={18} /> Tambah Transaksi
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <DashboardStats transactions={transactions} categories={categories} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Transaction List */}
          <div className="lg:col-span-2">
            <TransactionList 
              transactions={transactions} 
              categories={categories}
              onEdit={openEditModal}
              onDelete={handleDeleteTransaction}
              onView={openViewModal}
            />
          </div>

          {/* Sidebar: Budgeting */}
          <div className="lg:col-span-1">
            <BudgetOverview 
              transactions={transactions} 
              categories={categories}
              onEditCategory={openCategoryModal} 
            />
          </div>
        </div>
      </div>

      {/* Transaction Modal (Edit/Add) */}
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        categories={categories}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
        initialData={editingCategory}
      />

      {/* Detail Modal */}
      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        transaction={viewingTransaction}
        category={categories.find(c => c.id === viewingTransaction?.category_id)}
        onEdit={() => {
          if (viewingTransaction) {
            openEditModal(viewingTransaction);
          }
        }}
      />
    </main>
  );
}
