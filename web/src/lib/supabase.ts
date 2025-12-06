import { createClient } from '@supabase/supabase-js';

// Hardcoded for debugging
const supabaseUrl = 'https://qujyptqlnpznimaoastj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1anlwdHFsbnB6bmltYW9hc3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDM0ODUsImV4cCI6MjA4MDMxOTQ4NX0.v9tnE9QcvycO7CIfOLYVh0ERbXOJVLnA7nwQRceD91I';

// if (!supabaseUrl || !supabaseKey) {
//     console.error('Missing Supabase URL or Key in environment variables!');
// }

export const supabase = createClient(supabaseUrl, supabaseKey);
