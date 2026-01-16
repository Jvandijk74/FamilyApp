-- FamilyApp Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping list items table
CREATE TABLE IF NOT EXISTS shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quantity TEXT,
  category TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat history table for AI context
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_shopping_items_user_id ON shopping_items(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_is_completed ON shopping_items(is_completed);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can read all users but only modify their own)
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for calendar_events (all authenticated users can read and create)
CREATE POLICY "Everyone can view calendar events" ON calendar_events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create calendar events" ON calendar_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update any calendar event" ON calendar_events
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete any calendar event" ON calendar_events
  FOR DELETE USING (true);

-- RLS Policies for shopping_items (all authenticated users can read and create)
CREATE POLICY "Everyone can view shopping items" ON shopping_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create shopping items" ON shopping_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update any shopping item" ON shopping_items
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete any shopping item" ON shopping_items
  FOR DELETE USING (true);

-- RLS Policies for chat_history
CREATE POLICY "Users can view all chat history" ON chat_history
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create chat history" ON chat_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete chat history" ON chat_history
  FOR DELETE USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update updated_at automatically
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_items_updated_at
  BEFORE UPDATE ON shopping_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
