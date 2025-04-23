import { selectData } from '../lib/supabase.js';

/**
 * GET /api/availability?roomTypeId=1&checkIn=2023-06-01&checkOut=2023-06-05
 * Check if a room is available for the specified dates
 */
export default async (req, res) => {
  try {
    const { roomTypeId, checkIn, checkOut } = req.query;

    // Validate required parameters
    if (!roomTypeId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'roomTypeId, checkIn, and checkOut parameters are required'
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        error: 'Check-out date must be after check-in date'
      });
    }

    // Verify the room type exists
    const roomTypes = await selectData('room_types', {
      select: 'id',
      filters: { id: parseInt(roomTypeId) }
    });

    if (!roomTypes || roomTypes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room type not found'
      });
    }

    // Check if there are any bookings that overlap with the requested dates
    const bookings = await selectData('bookings', {
      select: 'id',
      filters: { room_type_id: parseInt(roomTypeId) }
    });

    // Filter bookings that overlap with the requested date range
    const overlappingBookings = bookings.filter(booking => {
      const bookingCheckIn = new Date(booking.check_in_date);
      const bookingCheckOut = new Date(booking.check_out_date);

      // Check if there's an overlap
      return (
        (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
        (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
        (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
      );
    });

    // Alternative approach: Check room_availability table if it's being used
    const availability = await selectData('room_availability', {
      select: 'id, available_rooms',
      filters: { 
        room_type_id: parseInt(roomTypeId),
        date: { gte: checkIn, lt: checkOut }
      }
    });

    // Determine if room is available based on availability records or bookings
    let available;
    
    if (availability && availability.length > 0) {
      // If using room_availability table, check if all days have available rooms
      available = availability.every(day => day.available_rooms > 0);
    } else {
      // If using bookings table, check if there are no overlapping bookings
      available = overlappingBookings.length === 0;
    }

    // Return availability status
    return res.status(200).json({
      success: true,
      data: {
        roomTypeId,
        checkIn,
        checkOut,
        available
      }
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check availability',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
