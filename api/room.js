import { getDb, initDb } from './_utils/db.js';
import { handleError, setCorsHeaders, sendSuccessResponse, sendErrorResponse } from './_utils/middleware.js';

/**
 * GET /api/room?slug=room-slug
 * Get detailed information about a specific room type
 */
export default async (req, res) => {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Initialize database in production environment
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }

  try {
    // Get room slug from query params
    const { slug } = req.query;

    if (!slug) {
      return sendErrorResponse(res, 'Room slug is required', 400);
    }

    // Connect to the database
    const db = await getDb();

    // Get the room type
    const room = await db.get(`
      SELECT 
        id, 
        name, 
        slug, 
        description,
        full_description, 
        price_per_night, 
        size_sqm, 
        size_sqft, 
        bed_type, 
        max_occupancy, 
        view_type
      FROM room_types
      WHERE slug = ?
    `, [slug]);

    if (!room) {
      return sendErrorResponse(res, 'Room not found', 404);
    }

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

    // Combine everything and return
    const roomDetails = {
      ...room,
      amenities: amenities.map(a => a.amenity),
      images: images.map(img => img.image_url)
    };

    return sendSuccessResponse(res, roomDetails);
  } catch (error) {
    return handleError(res, error);
  }
};
