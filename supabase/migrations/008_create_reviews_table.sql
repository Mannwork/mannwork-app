-- Crear tabla reviews
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  reviewer_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  reviewed_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  commentary TEXT,
  calification NUMERIC(2,1) NOT NULL CHECK (calification >= 0 AND calification <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX idx_reviews_request_id ON reviews(request_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id); 