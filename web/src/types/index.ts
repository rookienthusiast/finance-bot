export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  budget_limit: number;
  icon: string;
  color: string;
}

export interface TransactionItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  date: string;
  store: string;
  category_id: string | null;
  type: TransactionType;
  total: number;
  items?: TransactionItem[];
  category?: Category; // Joined
}
