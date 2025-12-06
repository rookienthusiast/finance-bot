'use client';

import React, { useState } from 'react';

interface TransactionItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

interface Transaction {
  id: string;
  date: string;
  store: string;
  category: string;
  total: number;
  items?: TransactionItem[];
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Tanggal</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Toko</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Kategori</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Total</th>
              <th className="px-6 py-4 font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <React.Fragment key={t.id}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleRow(t.id)}
                >
                  <td className="px-6 py-4 text-gray-600">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{t.store}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {t.category || 'Umum'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    Rp {t.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    {expandedRow === t.id ? '▲' : '▼'}
                  </td>
                </tr>
                {expandedRow === t.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="text-xs text-gray-500 mb-2 font-semibold">DETAIL ITEM:</div>
                      <ul className="space-y-1">
                        {t.items && t.items.length > 0 ? (
                          t.items.map((item) => (
                            <li key={item.id} className="flex justify-between text-sm text-gray-600">
                              <span>{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                              <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">Tidak ada detail item</li>
                        )}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Belum ada transaksi bulan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
