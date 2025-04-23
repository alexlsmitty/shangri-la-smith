// api/spa-categories.js
import { selectData } from '../lib/supabase.js';

// Get all spa categories
export default async (req, res) => {
  try {
    // Query categories from Supabase
    const categories = await selectData('spa_categories', {
      select: 'id, name, description',
      orderBy: 'name'
    });
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching spa categories:', error);
    res.status(500).json({ error: 'Failed to fetch spa categories', detail: error.message });
  }
};
