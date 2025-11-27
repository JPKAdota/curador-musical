import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Create a client only if the environment variables are available
// This prevents build errors during static generation if env vars are missing
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : {
    // Mock client that throws informative errors if used without proper config
    from: () => ({
      select: () => Promise.reject(new Error('Supabase not configured. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.')),
      insert: () => Promise.reject(new Error('Supabase not configured. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.')),
      update: () => Promise.reject(new Error('Supabase not configured. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.')),
      delete: () => Promise.reject(new Error('Supabase not configured. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.')),
    })
  };

export default supabase;