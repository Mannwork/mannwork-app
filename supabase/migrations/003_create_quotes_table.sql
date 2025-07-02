create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  requestId uuid,
  professionalId text references users(id) on delete set null,
  clientId text references users(id) on delete set null,
  price numeric,
  descriptionService text,
  durationEstimate text,
  status text check (status in ('pending', 'accepted', 'rejected', 'expired')) default 'pending',
  validUntil timestamp,
  createdAt timestamp with time zone default timezone('utc', now()),
  updatedAt timestamp with time zone default timezone('utc', now())
);

create index if not exists idx_quotes_request on quotes(requestId);
create index if not exists idx_quotes_professional on quotes(professionalId);
create index if not exists idx_quotes_client on quotes(clientId); 