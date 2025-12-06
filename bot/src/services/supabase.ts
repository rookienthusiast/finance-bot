import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

const supabaseUrl = config.supabase.url || '';
const supabaseKey = config.supabase.key || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveStagingTransaction = async (telegramId: string, data: any) => {
  const { error } = await supabase
    .from('staging_transactions')
    .insert({
      phone_number: telegramId, // We use this column for Telegram ID now
      data: data,
      status: 'pending',
    });

  if (error) {
    console.error('Error saving staging transaction:', error);
    throw error;
  }
};

export const getPendingTransaction = async (telegramId: string) => {
  const { data, error } = await supabase
    .from('staging_transactions')
    .select('*')
    .eq('phone_number', telegramId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }
  return data;
};

export const confirmTransaction = async (stagingId: string) => {
    const { error } = await supabase
        .from('staging_transactions')
        .update({ status: 'confirmed' })
        .eq('id', stagingId);
    
    if (error) throw error;
};

export const saveTransaction = async (userId: string, data: any) => {
  // 1. Create Transaction
  const { data: transaction, error: transError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      date: data.date,
      store: data.store,
      total: data.total,
      category: 'Uncategorized', // Default
    })
    .select()
    .single();

  if (transError) throw transError;

  // 2. Create Transaction Items
  if (data.items && data.items.length > 0) {
    const items = data.items.map((item: any) => ({
      transaction_id: transaction.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      subtotal: item.total,
    }));

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(items);

    if (itemsError) throw itemsError;
  }

  return transaction;
};

export const getUserByPhone = async (telegramId: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', telegramId)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error("Error fetching user", error);
    }
    return data;
};

export const createUser = async (telegramId: string, name: string) => {
    const { data, error } = await supabase
        .from('users')
        .insert({ phone_number: telegramId, name: name })
        .select()
        .single();
    
    if (error) throw error;
    return data;
};
