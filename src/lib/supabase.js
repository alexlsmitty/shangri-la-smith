// Re-export supabase functions from the main library
export { 
  getSupabase,
  selectData,
  insertData,
  updateData,
  deleteData,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  refreshSession
} from '../../lib/supabase';
