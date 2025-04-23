import { selectData } from '../lib/supabase.js';

export default async function handler(req, res) {
  try {
    // Query room types using Supabase
    const rooms = await selectData('room_types', {
      select: `
        id,
        name,
        slug,
        description,
        price_per_night,
        view_type,
        max_occupancy,
        bedding_config,
        room_size,
        is_accessible,
        amenities,
        room_images (
          id,
          image_url,
          alt_text,
          is_primary
        )
      `,
      orderBy: 'price_per_night',
      ascending: true
    });
    
    // Format the response to match your current API structure
    const formattedRooms = rooms.map(room => {
      // Find the primary image or the first image
      const primaryImage = room.room_images?.find(img => img.is_primary) || room.room_images?.[0];
      
      return {
        id: room.id,
        name: room.name,
        slug: room.slug,
        description: room.description,
        price_per_night: room.price_per_night,
        view_type: room.view_type,
        max_occupancy: room.max_occupancy || 2, // Default value if not available
        bedding_config: room.bedding_config || 'King Bed', // Default value if not available
        room_size: room.room_size || 400, // Default value if not available in square feet
        is_accessible: room.is_accessible || false,
        amenities: room.amenities || [],
        image_url: primaryImage?.image_url || '/images/rooms/default-room.jpg' // Default image path
      };
    });
    
    // Return the rooms data
    return res.status(200).json({
      success: true,
      data: formattedRooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch rooms',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
