import React from 'react';
import { Transaction, Category } from '@/types';
import { X, Calendar, MapPin, Tag, Receipt } from 'lucide-react';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  category: Category | undefined;
  onEdit: () => void;
}

export function TransactionDetailModal({ isOpen, onClose, transaction, category, onEdit }: TransactionDetailModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detail Transaksi</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {transaction.id.slice(0, 8)}...</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Toko / Merchant</p>
                <p className="text-lg font-semibold text-gray-900">{transaction.store}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Tanggal</p>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(transaction.date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Kategori</p>
                <div className="flex items-center gap-2 mt-1">
                  {category ? (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                      {category.icon} {category.name}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      ❓ Uncategorized
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items List (Receipt) */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
              <Receipt size={18} />
              <span>Rincian Item</span>
            </div>
            
            {transaction.items && transaction.items.length > 0 ? (
              <div className="space-y-2">
                {transaction.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.qty}</span>
                    </div>
                    <div className="text-gray-900 font-mono">
                      {item.subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rp {transaction.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Tidak ada rincian item.</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit();
            }}
            className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm"
          >
            Edit Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}
