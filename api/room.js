import { selectData } from '../lib/supabase.js';

/**
 * GET /api/room?slug=room-slug
 * Get detailed information about a specific room type
 */
export default async (req, res) => {
  try {
    // Get room slug from query params
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Room slug is required'
      });
    }

    // Query the room from Supabase
    const rooms = await selectData('room_types', {
      select: `
        id, 
        name, 
        slug, 
        description,
        price_per_night,
        max_occupancy, 
        bedding_config,
        room_size,
        view_type,
        is_accessible,
        amenities,
        room_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        )
      `,
      filters: { slug }
    });

    // Check if room exists
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const room = rooms[0];
    
    // Format images
    const images = room.room_images || [];
    
    // Sort images by sort_order if available
    const sortedImages = [...images].sort((a, b) => 
      (a.sort_order || 0) - (b.sort_order || 0)
    );

    // Organize the response object
    const roomDetails = {
      id: room.id,
      name: room.name,
      slug: room.slug,
      description: room.description,
      price_per_night: room.price_per_night,
      max_occupancy: room.max_occupancy || 2,
      bedding_config: room.bedding_config || 'King Bed',
      room_size: room.room_size || 400,
      view_type: room.view_type || 'Ocean View',
      is_accessible: room.is_accessible || false,
      amenities: room.amenities || [],
      images: sortedImages.map(img => img.image_url)
    };

    return res.status(200).json({
      success: true,
      data: roomDetails
    });
  } catch (error) {
    console.error('Error fetching room details:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch room details',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
