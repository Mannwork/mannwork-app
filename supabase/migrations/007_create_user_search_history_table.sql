-- Create user_search_history table
CREATE TABLE IF NOT EXISTS user_search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicates for the same user, category, and subcategory
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_search_history_unique 
ON user_search_history(user_id, category, subcategory);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_user_search_history_user_id 
ON user_search_history(user_id);

-- Create index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_user_search_history_created_at 
ON user_search_history(created_at DESC);

-- Enable RLS
ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own search history" ON user_search_history
    FOR SELECT USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own search history" ON user_search_history
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own search history" ON user_search_history
    FOR UPDATE USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can delete their own search history" ON user_search_history
    FOR DELETE USING (auth.jwt() ->> 'sub' = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_search_history_updated_at 
    BEFORE UPDATE ON user_search_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 