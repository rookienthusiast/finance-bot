-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null unique, -- Format: 628123456789
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Transactions Table (Final Data)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  store text not null,
  category text, -- e.g., 'Food', 'Transport', 'Utilities'
  total numeric(12, 2) not null,
  image_url text, -- Optional: link to the receipt image in storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Transaction Items Table (Details)
create table public.transaction_items (
  id uuid default uuid_generate_v4() primary key,
  transaction_id uuid references public.transactions(id) on delete cascade not null,
  name text not null,
  qty numeric(10, 2) default 1,
  price numeric(12, 2) not null, -- Price per item
  subtotal numeric(12, 2) not null -- qty * price
);

-- 4. Staging Transactions (Temporary storage for AI results before confirmation)
create table public.staging_transactions (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null, -- To link back to the WA user
  data jsonb not null, -- Stores the full JSON extracted by AI
  image_url text,
  status text default 'pending', -- 'pending', 'confirmed', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone default timezone('utc'::text, now() + interval '1 hour')
);

-- Indexes for performance
create index idx_transactions_user_date on public.transactions(user_id, date);
create index idx_staging_phone on public.staging_transactions(phone_number);
