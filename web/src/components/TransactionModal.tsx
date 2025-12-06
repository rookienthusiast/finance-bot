import React from 'react';
import { Category, Transaction, TransactionItem } from '@/types';
import { X, Plus, Trash2 } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Transaction>, items: Partial<TransactionItem>[]) => void;
  initialData?: Transaction | null;
  categories: Category[];
}

export function TransactionModal({ isOpen, onClose, onSave, initialData, categories }: TransactionModalProps) {
  const [formData, setFormData] = React.useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    store: '',
    total: 0,
    type: 'expense',
    category_id: '',
  });

  const [items, setItems] = React.useState<Partial<TransactionItem>[]>([]);

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        category_id: initialData.category_id || '',
      });
      // Load existing items if any
      if (initialData.items) {
        setItems(initialData.items);
      } else {
        setItems([]);
      }
    } else {
      // Reset for new entry
      setFormData({
        date: new Date().toISOString().split('T')[0],
        store: '',
        total: 0,
        type: 'expense',
        category_id: '',
      });
      setItems([]);
    }
  }, [initialData, isOpen]);

  // Auto-calculate total when items change
  React.useEffect(() => {
    const itemsTotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    if (itemsTotal > 0) {
      setFormData(prev => ({ ...prev, total: itemsTotal }));
    }
  }, [items]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, items);
    onClose();
  };

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0, subtotal: 0 }]);
  };

  const updateItem = (index: number, field: keyof TransactionItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // Recalculate subtotal
    if (field === 'qty' || field === 'price') {
      const qty = field === 'qty' ? Number(value) : (item.qty || 0);
      const price = field === 'price' ? Number(value) : (item.price || 0);
      item.subtotal = qty * price;
    }

    newItems[index] = item as TransactionItem;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Top Section: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type Selection */}
              <div className="md:col-span-2 flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.type === 'expense' 
                      ? 'bg-white text-red-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.type === 'income' 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={formData.category_id || ''}
                  onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === 'expense' ? 'Nama Toko / Keperluan' : 'Sumber Dana'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.store}
                  onChange={e => setFormData({ ...formData, store: e.target.value })}
                  placeholder={formData.type === 'expense' ? "Contoh: Indomaret, Bensin" : "Contoh: Gaji, Bonus"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Rincian Item (Opsional)</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus size={16} /> Tambah Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Nama Barang"
                        value={item.name}
                        onChange={e => updateItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.qty}
                        onChange={e => updateItem(index, 'qty', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-center"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        placeholder="Harga"
                        min="0"
                        value={item.price}
                        onChange={e => updateItem(index, 'price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 text-right"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                
                {items.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
                    Belum ada item. Klik "Tambah Item" untuk mengisi rincian.
                  </div>
                )}
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-200">
              <span className="font-medium text-gray-700">Total Transaksi</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Rp</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.total}
                  onChange={e => setFormData({ ...formData, total: Number(e.target.value) })}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg font-bold text-right text-gray-900"
                />
              </div>
            </div>

          </div>

          <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
