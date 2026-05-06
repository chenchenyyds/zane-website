-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  git_url TEXT,
  live_url TEXT,
  tech_stack TEXT[],
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies for projects
CREATE POLICY "Public projects are viewable by everyone" ON projects
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can do everything with projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for notes
CREATE POLICY "Public notes are viewable by everyone" ON notes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can do everything with notes" ON notes
  FOR ALL USING (auth.role() = 'authenticated');
