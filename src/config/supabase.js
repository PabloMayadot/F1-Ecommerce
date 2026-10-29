import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from './config.js'

const hasValidSupabaseConfig =
    Boolean(SUPABASE_URL && SUPABASE_KEY) &&
    /^https?:\/\//i.test(SUPABASE_URL) &&
    SUPABASE_URL !== 'your_supabase_url' &&
    SUPABASE_KEY !== 'your_supabase_key'

export const supabase = hasValidSupabaseConfig
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null

