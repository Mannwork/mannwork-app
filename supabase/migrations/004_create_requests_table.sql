create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location jsonb,
  scheduleDate timestamp,
  photos text[],
  client text references users(id) on delete set null,
  status text check (status in ('searching', 'accepted', 'working', 'paid', 'completed', 'cancelled')) default 'searching',
  bill text,
  category bigint references categories(id) on delete set null,
  subCategory text,
  selectedQuote uuid references quotes(id) on delete set null,
  inserted_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Indexes for performance
create index if not exists idx_requests_client on requests(client);
create index if not exists idx_requests_category on requests(category);
create index if not exists idx_requests_status on requests(status); 