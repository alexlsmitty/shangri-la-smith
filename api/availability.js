import { getDb, isRoomAvailable, initDb } from './_utils/db.js';
import { handleError, setCorsHeaders, sendSuccessResponse, sendErrorResponse } from './_utils/middleware.js';

/**
 * GET /api/availability?roomTypeId=1&checkIn=2023-06-01&checkOut=2023-06-05
 * Check if a room is available for the specified dates
 */
export default async (req, res) => {
  // Set CORS headers
  setCorsHeaders(req, res);
  
  // Initialize database in production environment
  if (process.env.NODE_ENV === 'production') {
    await initDb();
  }

  try {
    const { roomTypeId, checkIn, checkOut } = req.query;

    // Validate required parameters
    if (!roomTypeId || !checkIn || !checkOut) {
      return sendErrorResponse(
        res,
        'roomTypeId, checkIn, and checkOut parameters are required',
        400
      );
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return sendErrorResponse(res, 'Invalid date format', 400);
    }

    if (checkInDate >= checkOutDate) {
      return sendErrorResponse(
        res,
        'Check-out date must be after check-in date',
        400
      );
    }

    // Connect to the database
    const db = await getDb();

    // Verify the room type exists
    const roomType = await db.get(
      'SELECT id FROM room_types WHERE id = ?',
      [roomTypeId]
    );

    if (!roomType) {
      return sendErrorResponse(res, 'Room type not found', 404);
    }

    // Check availability
    const available = await isRoomAvailable(
      db,
      roomTypeId,
      checkIn,
      checkOut
    );

    // Return availability status
    return sendSuccessResponse(res, {
      roomTypeId,
      checkIn,
      checkOut,
      available
    });
  } catch (error) {
    return handleError(res, error);
  }
};
