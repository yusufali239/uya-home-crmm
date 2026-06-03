-- ===========================================================
-- UYA HOME CRM — Supabase Schema
-- Выполните этот SQL в Supabase → SQL Editor
-- ============================================================

-- CLIENTS
create table clients (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  source text default 'Instagram',
  city text,
  created_at timestamptz default now()
);

-- CATALOG
create table catalog (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric default 0,
  cost numeric default 0,
  emoji text default '🪑',
  description text,
  created_at timestamptz default now()
);

-- ORDERS
create table orders (
  id bigint generated always as identity primary key,
  client_id bigint references clients(id) on delete set null,
  product text not null,
  custom_product text,
  price numeric default 0,
  cost numeric default 0,
  prepaid numeric default 0,
  status text default 'Новый',
  source text default 'Instagram',
  order_date date default current_date,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- EXPENSES
create table expenses (
  id bigint generated always as identity primary key,
  category text not null,
  amount numeric default 0,
  note text,
  expense_date date default current_date,
  created_at timestamptz default now()
);

-- Seed catalog
insert into catalog (name, price, cost, emoji, description) values
  ('Қомпьютерный столь, 12000, 7000, '☕', 'Компактный, разные цвета'),
  ('Книжный стеллаж', 12000, 7000, '📚', '5 полок, регулируемые'),
  ('Полка настенная', 4500, 2500, '🗄️', 'Настенный монтаж'),
  ('Компьютерный столь, 12000, 7000, '☕', 'Компактный, разные цвета');

-- Row Level Security
alter table clients enable row level security;
alter table orders enable row level security;
alter table catalog enable row level security;
alter table expenses enable row level security;

create policy "Auth users can do everything on clients"
  on clients for all using (auth.role() = 'authenticated');

create policy "Auth users can do everything on orders"
  on orders for all using (auth.role() = 'authenticated');

create policy "Auth users can do everything on catalog"
  on catalog for all using (auth.role() = 'authenticated');

create policy "Auth users can do everything on expenses"
  on expenses for all using (auth.role() = 'authenticated');

-- Auto-update updated_at on orders
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
