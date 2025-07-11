-- Tabla intermedia para vincular profesionales y solicitudes
CREATE TABLE IF NOT EXISTS request_professionals (
  id BIGSERIAL PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  professional_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para consultas rápidas
create index if not exists idx_request_professionals_request on request_professionals(request_id);
create index if not exists idx_request_professionals_professional on request_professionals(professional_id); 