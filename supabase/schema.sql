-- Chhaya Jewellers database schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('admin','staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Gold','Silver','Diamond','Bridal jewellery','Coins and bars','Daily wear jewellery')),
  price numeric(12,2) not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  weight_grams numeric(10,3),
  purity text,
  making_charges numeric(12,2),
  description text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_mobile text not null,
  customer_address text not null,
  customer_city text not null,
  customer_state text not null,
  customer_pin text not null,
  subtotal numeric(12,2) not null,
  delivery_charge numeric(12,2),
  fulfilment text not null default 'To be confirmed',
  status text not null default 'Confirmed',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null
);

-- Secure order placement: prices and stock are read from the database, never trusted from browser cart.
create or replace function public.place_customer_order(
 customer_name text, customer_mobile text, customer_address text,
 customer_city text, customer_state text, customer_pin text, items_json jsonb, customer_fulfilment text default 'Home delivery'
) returns text language plpgsql security definer set search_path=public as $$
declare
  new_order_id uuid;
  new_order_number text;
  subtotal_value numeric(12,2) := 0;
  item jsonb;
  p public.products%rowtype;
  qty integer;
begin
  if jsonb_typeof(items_json) <> 'array' or jsonb_array_length(items_json)=0 then
    raise exception 'Cart is empty';
  end if;
  for item in select * from jsonb_array_elements(items_json) loop
    qty := (item->>'quantity')::integer;
    select * into p from public.products where id=(item->>'product_id')::uuid and active=true for update;
    if not found then raise exception 'A product is no longer available'; end if;
    if qty < 1 or p.stock_quantity < qty then raise exception 'Insufficient stock for %',p.name; end if;
    subtotal_value := subtotal_value + (p.price * qty);
  end loop;

  new_order_number := 'CJ-' || to_char(now(),'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  insert into public.orders(order_number,customer_name,customer_mobile,customer_address,customer_city,customer_state,customer_pin,subtotal,status,fulfilment)
  values(new_order_number,customer_name,customer_mobile,customer_address,customer_city,customer_state,customer_pin,subtotal_value,'Confirmed',customer_fulfilment)
  returning id into new_order_id;

  for item in select * from jsonb_array_elements(items_json) loop
    qty := (item->>'quantity')::integer;
    select * into p from public.products where id=(item->>'product_id')::uuid for update;
    insert into public.order_items(order_id,product_id,product_name,quantity,unit_price)
    values(new_order_id,p.id,p.name,qty,p.price);
    update public.products set stock_quantity=stock_quantity-qty where id=p.id;
  end loop;
  return new_order_number;
end; $$;

revoke all on function public.place_customer_order(text,text,text,text,text,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.place_customer_order(text,text,text,text,text,text,jsonb,text) to service_role;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public can read active products only.
create policy "Anyone can view active products" on public.products for select using (active=true);
-- Signed-in staff/admin can read their profile.
create policy "Users can read own profile" on public.profiles for select to authenticated using (auth.uid()=id);
-- Admin/staff policies; role is checked via profile row.
create policy "Staff can manage products" on public.products for all to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','staff') and p.active))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','staff') and p.active));
create policy "Staff can view orders" on public.orders for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','staff') and p.active));
create policy "Staff can update orders" on public.orders for update to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','staff') and p.active))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','staff') and p.active));
create policy "Staff can view order items" on public.order_items for select to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','staff') and p.active));

-- Create staff profile rows after creating each user in Supabase Auth.
-- Example (replace UUID): insert into public.profiles(id,full_name,role) values('AUTH-USER-UUID','Owner','admin');
