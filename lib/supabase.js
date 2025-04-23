// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
// In Vite, browser-exposed env variables must be prefixed with VITE_
// Fallback to hardcoded values if env vars are not available
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://cdpoutqhdduzprdobfqt.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcG91dHFoZGR1enByZG9iZnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTE2NjQsImV4cCI6MjA2MDk2NzY2NH0.ZwDNnQNqQgfm5LOTA6_81g44gqIFRLikPRW_wh87eRI';
// Service role key for operations that need to bypass RLS policies
// Note: In production, this should be stored securely and only used server-side
const supabaseServiceKey = import.meta.env?.VITE_SUPABASE_SERVICE_KEY || '';

// Singleton pattern for the Supabase client
let supabaseInstance = null;
let supabaseAdminInstance = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase credentials. Please check your environment variables.');
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseInstance;
};

// Get admin/service client with elevated privileges
export const getSupabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn('Missing Supabase service key. Falling back to anon key for admin operations.');
      return getSupabase(); // Fallback to regular client
    }
    
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey);
  }
  
  return supabaseAdminInstance;
};

/**
 * Executes a select query on a Supabase table with optional filters and modifiers
 * @param {string} tableName - The name of the table to query
 * @param {Object} options - Query options
 * @param {string|string[]} options.select - Columns to select
 * @param {Object} options.filters - Filters to apply (key: value pairs)
 * @param {string} options.orderBy - Column to order by
 * @param {boolean} options.ascending - Order direction (true for ascending)
 * @param {number} options.limit - Maximum number of results
 * @param {number} options.offset - Offset for pagination
 * @param {Object} options.relations - Relations to include (key: field name, value: relation options)
 * @returns {Promise<Array>} - The query results
 */
export async function selectData(tableName, options = {}) {
  const supabase = getSupabase();
  
  // Start with the basic select query
  let query = supabase.from(tableName).select(
    options.select || '*'
  );
  
  // Apply filters if provided
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value); // IN operator for arrays
        } else if (typeof value === 'object') {
          // Handle range queries with gt, lt, gte, lte
          Object.entries(value).forEach(([operator, operand]) => {
            query = query[operator](key, operand);
          });
        } else {
          query = query.eq(key, value); // Equality for simple values
        }
      }
    });
  }
  
  // Apply ordering if provided
  if (options.orderBy) {
    query = query.order(options.orderBy, { 
      ascending: options.ascending !== false 
    });
  }
  
  // Apply pagination if provided
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  if (options.offset) {
    query = query.offset(options.offset);
  }
  
  // Execute the query
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error querying ${tableName}:`, error);
    throw error;
  }
  
  return data || [];
}

/**
 * Inserts one or more records into a Supabase table
 * @param {string} tableName - The name of the table
 * @param {Object|Array} records - Record(s) to insert
 * @param {Object} options - Insert options
 * @param {boolean} options.upsert - Whether to upsert (insert or update)
 * @param {string|string[]} options.returning - Columns to return
 * @param {boolean} options.useAdmin - Whether to use admin privileges to bypass RLS
 * @returns {Promise<Object|Array>} - The inserted record(s)
 */
export async function insertData(tableName, records, options = {}) {
  // Use admin client if specified in options, otherwise use regular client
  const supabase = options.useAdmin ? getSupabaseAdmin() : getSupabase();
  
  let query = supabase.from(tableName).insert(records);
  
  // Handle upsert option
  if (options.upsert) {
    query = query.upsert(records);
  }
  
  // Specify which columns to return
  if (options.returning) {
    query = query.select(options.returning);
  } else {
    query = query.select();
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error inserting into ${tableName}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Updates records in a Supabase table
 * @param {string} tableName - The name of the table
 * @param {Object} updates - Fields to update
 * @param {Object} filters - Filters to determine which records to update
 * @param {Object} options - Update options
 * @param {string|string[]} options.returning - Columns to return
 * @param {boolean} options.useAdmin - Whether to use admin privileges to bypass RLS
 * @returns {Promise<Array>} - The updated records
 */
export async function updateData(tableName, updates, filters, options = {}) {
  // Use admin client if specified in options, otherwise use regular client
  const supabase = options.useAdmin ? getSupabaseAdmin() : getSupabase();
  
  let query = supabase.from(tableName).update(updates);
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        query = query.in(key, value); // IN operator for arrays
      } else {
        query = query.eq(key, value); // Equality for simple values
      }
    }
  });
  
  // Specify which columns to return
  if (options.returning) {
    query = query.select(options.returning);
  } else {
    query = query.select();
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw error;
  }
  
  return data;
}

/**
 * Deletes records from a Supabase table
 * @param {string} tableName - The name of the table
 * @param {Object} filters - Filters to determine which records to delete
 * @param {Object} options - Delete options
 * @param {boolean} options.useAdmin - Whether to use admin privileges to bypass RLS
 * @returns {Promise<boolean>} - Success indicator
 */
export async function deleteData(tableName, filters, options = {}) {
  // Use admin client if specified in options, otherwise use regular client
  const supabase = options.useAdmin ? getSupabaseAdmin() : getSupabase();
  
  let query = supabase.from(tableName).delete();
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        query = query.in(key, value); // IN operator for arrays
      } else {
        query = query.eq(key, value); // Equality for simple values
      }
    }
  });
  
  const { error } = await query;
  
  if (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw error;
  }
  
  return true;
}

/**
 * Authentication helpers
 */

// Sign up a new user
export async function signUp(email, password, userData = {}) {
  const supabase = getSupabase();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }
  
  return data;
}

// Sign in an existing user
export async function signIn(email, password) {
  const supabase = getSupabase();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }
  
  return data;
}

// Sign out the current user
export async function signOut() {
  const supabase = getSupabase();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
  
  return true;
}

// Get the current user
export async function getCurrentUser() {
  const supabase = getSupabase();
  
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return data?.user || null;
}

// Get the current session
export async function getSession() {
  const supabase = getSupabase();
  
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return data?.session || null;
}

// Refresh the current session
export async function refreshSession() {
  const supabase = getSupabase();
  
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
  
  return data?.session || null;
}
