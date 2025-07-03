create table if not exists request_professionals (
  request_id uuid references requests(id) on delete cascade,
  professional_id text references users(id) on delete cascade,
  assigned_at timestamp with time zone default timezone('utc', now()),
  primary key (request_id, professional_id)
);

-- Índices para consultas rápidas
create index if not exists idx_request_professionals_request on request_professionals(request_id);
create index if not exists idx_request_professionals_professional on request_professionals(professional_id); 