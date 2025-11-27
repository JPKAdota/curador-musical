import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Helper to create a chainable mock that throws a clear error when executed
const createMockClient = () => {
  const error = new Error('Supabase not configured. Check SUPABASE_URL and SUPABASE_SERVICE_KEY in Vercel Settings.');

  // A proxy that returns itself for any property access, 
  // but returns a rejected promise when 'then' is accessed (simulating await)
  const handler = {
    get: (target, prop) => {
      if (prop === 'then') {
        return (resolve, reject) => reject(error);
      }
      return new Proxy(() => { }, handler);
    },
    apply: (target, thisArg, argumentsList) => {
      return new Proxy(() => { }, handler);
    }
  };

  return new Proxy({}, handler);
};

// Create a client only if the environment variables are available
// This prevents build errors during static generation if env vars are missing
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : createMockClient();

export default supabase;