import { getDb } from './serverless-util.js';

export default async function handler(req, res) {
  try {
    // Get database connection
    const db = await getDb();
    
    // Query room types
    const rooms = await db.all(`
      SELECT 
        r.id, 
        r.name, 
        r.slug, 
        r.description,
        r.price_per_night,
        r.view_type,
        ri.image_url
      FROM room_types r
      LEFT JOIN room_images ri ON r.id = ri.room_type_id
      GROUP BY r.id
      ORDER BY r.price_per_night ASC
    `);
    
    // Close the database connection
    await db.close();
    
    // Return the rooms
    return res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch rooms',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
