import React from 'react';
import { Category, TransactionType } from '@/types';
import { X, ChevronDown } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
  onDelete: (id: string) => void;
  initialData?: Category | null;
}

const COLORS = [
  { name: 'Red', value: 'bg-red-100 text-red-600' },
  { name: 'Orange', value: 'bg-orange-100 text-orange-600' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-600' },
  { name: 'Green', value: 'bg-green-100 text-green-600' },
  { name: 'Teal', value: 'bg-teal-100 text-teal-600' },
  { name: 'Blue', value: 'bg-blue-100 text-blue-600' },
  { name: 'Indigo', value: 'bg-indigo-100 text-indigo-600' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-600' },
  { name: 'Pink', value: 'bg-pink-100 text-pink-600' },
  { name: 'Gray', value: 'bg-gray-100 text-gray-600' },
];

const EMOJIS = [
  '🍔', '☕', '🍺', '🛒', '👗', '👕', 
  '🚗', '⛽', '🚕', '✈️', '🏠', '💡', 
  '📱', '💻', '🎮', '🎬', '🎵', '📚',
  '🏥', '💊', '🏋️', '💅', '💇', '🎁',
  '💰', '💵', '💳', '🏦', '🎓', '🔧',
  '👶', '🐶', '🐱', '📝', '🔒', '❓'
];

export function CategoryModal({ isOpen, onClose, onSave, onDelete, initialData }: CategoryModalProps) {
  const [formData, setFormData] = React.useState<Partial<Category>>({
    name: '',
    type: 'expense',
    budget_limit: 0,
    icon: '📝',
    color: 'bg-gray-100 text-gray-600',
  });
  
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        type: 'expense',
        budget_limit: 0,
        icon: '📝',
        color: 'bg-gray-100 text-gray-600',
      });
    }
    setShowEmojiPicker(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Kategori' : 'Kategori Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Type Selection */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
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

          <div className="flex gap-4">
            <div className="w-1/4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ikon</label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 flex items-center justify-center gap-1"
              >
                {formData.icon}
              </button>
              
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-10 grid grid-cols-6 gap-2">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, icon: emoji });
                        setShowEmojiPicker(false);
                      }}
                      className="text-xl hover:bg-gray-100 p-1 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-3/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                placeholder="Contoh: Liburan"
              />
            </div>
          </div>

          {formData.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit Budget (Bulanan)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                <input
                  type="number"
                  min="0"
                  value={formData.budget_limit}
                  onChange={e => setFormData({ ...formData, budget_limit: Number(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-gray-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Warna Label</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color.value.split(' ')[0]} ${
                    formData.color === color.value ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            {initialData && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus kategori ini? Transaksi terkait akan menjadi Uncategorized.')) {
                    initialData.id && onDelete(initialData.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
              >
                Hapus
              </button>
            )}
            <div className="flex-1 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
