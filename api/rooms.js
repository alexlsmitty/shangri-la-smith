import { getDb, initDb } from './_utils/db.js';
import { handleError, setCorsHeaders, sendSuccessResponse } from './_utils/middleware.js';

/**
 * GET /api/rooms
 * Get all room types with their basic information
 */
export default async (req, res) => {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Initialize database in production environment
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }

  try {
    // Connect to the database
    const db = await getDb();

    // Get all room types with their amenities and images
    const roomTypes = await db.all(`
      SELECT 
        id, 
        name, 
        slug, 
        description, 
        price_per_night, 
        size_sqm, 
        size_sqft, 
        bed_type, 
        max_occupancy, 
        view_type
      FROM room_types
      ORDER BY price_per_night ASC
    `);

    // For each room type, get its amenities and images
    const roomsWithDetails = await Promise.all(
      roomTypes.map(async (room) => {
        // Get amenities
        const amenities = await db.all(`
          SELECT amenity 
          FROM room_amenities 
          WHERE room_type_id = ?
        `, [room.id]);

        // Get images
        const images = await db.all(`
          SELECT image_url 
          FROM room_images 
          WHERE room_type_id = ? 
          ORDER BY display_order ASC
        `, [room.id]);

        // Return room with amenities and images
        return {
          ...room,
          amenities: amenities.map(a => a.amenity),
          images: images.map(img => img.image_url)
        };
      })
    );

    // Return the room data
    return sendSuccessResponse(res, roomsWithDetails);
  } catch (error) {
    return handleError(res, error);
  }
};
