const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://prjhsnkudzmphnnhyicj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamhzbmt1ZHptcGhubmh5aWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NDg2MTMsImV4cCI6MjA4NDEyNDYxM30.5AFNZK5Ae0nJdPLyrCqo5dg9-TAOuRU_1p0_ro2SZyE';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

console.log('✅ Supabase client initialized successfully');
console.log('🔗 Connected to:', supabaseUrl);

module.exports = supabase;
