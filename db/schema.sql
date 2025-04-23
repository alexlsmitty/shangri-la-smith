-- Room Types Table
CREATE TABLE IF NOT EXISTS room_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  price_per_night REAL NOT NULL,
  size_sqm INTEGER NOT NULL,
  size_sqft INTEGER NOT NULL,
  bed_type TEXT NOT NULL,
  max_occupancy TEXT NOT NULL,
  view_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Room Amenities Table
CREATE TABLE IF NOT EXISTS room_amenities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_type_id INTEGER NOT NULL,
  amenity TEXT NOT NULL,
  FOREIGN KEY (room_type_id) REFERENCES room_types (id) ON DELETE CASCADE
);

-- Room Images Table
CREATE TABLE IF NOT EXISTS room_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_type_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (room_type_id) REFERENCES room_types (id) ON DELETE CASCADE
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_reference TEXT NOT NULL UNIQUE,
  room_type_id INTEGER NOT NULL,
  check_in_date TEXT NOT NULL,
  check_out_date TEXT NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  special_requests TEXT,
  payment_method TEXT NOT NULL,
  total_price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_date TIMESTAMP,
  FOREIGN KEY (room_type_id) REFERENCES room_types (id)
);

-- Index for faster availability checking
CREATE INDEX IF NOT EXISTS idx_bookings_dates_room 
ON bookings (room_type_id, check_in_date, check_out_date, status);

-- Spa tables follow below

-- Spa Categories Table
CREATE TABLE IF NOT EXISTS spa_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spa Services Table
CREATE TABLE IF NOT EXISTS spa_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  price REAL NOT NULL,
  featured INTEGER DEFAULT 0, -- 0 = false, 1 = true
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES spa_categories (id) ON DELETE CASCADE
);

-- Spa Appointments Table
CREATE TABLE IF NOT EXISTS spa_appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_reference TEXT NOT NULL UNIQUE,
  service_id INTEGER NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, completed, cancelled
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_date TIMESTAMP,
  price REAL NOT NULL,
  FOREIGN KEY (service_id) REFERENCES spa_services (id) ON DELETE RESTRICT
);

-- Index for appointment searching and scheduling
CREATE INDEX IF NOT EXISTS idx_spa_appointments_date_time 
ON spa_appointments (appointment_date, appointment_time, status);

-- Index for looking up appointments by service
CREATE INDEX IF NOT EXISTS idx_spa_appointments_service 
ON spa_appointments (service_id);

-- Seed data for room types
INSERT OR IGNORE INTO room_types (
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
) VALUES 
(
  'Ocean View Deluxe Room',
  'ocean-view-deluxe',
  'Indulge in stunning panoramic views of the ocean from your private balcony. These rooms offer a perfect blend of comfort and style.',
  'Experience unparalleled luxury with breathtaking ocean views from your private balcony in our Ocean View Deluxe Room. This meticulously designed accommodation offers the perfect blend of comfort, style, and modern amenities to ensure an unforgettable stay at Shangri La Beach Resort.

Wake up to the gentle sound of waves and enjoy your morning coffee while taking in the spectacular ocean panorama. Our Ocean View Deluxe Rooms feature elegant décor, premium furnishings, and thoughtful touches to create a serene atmosphere for your tropical getaway.',
  350,
  45,
  484,
  'King-sized bed',
  'Max 2 adults',
  'Ocean view'
),
(
  'Beachfront Suite',
  'beachfront-suite',
  'Step directly onto the sand from your spacious suite. Enjoy the ultimate beachfront experience with added luxury and privacy.',
  'Embrace the ultimate beach lifestyle in our Beachfront Suite, where luxury meets the pristine shoreline. These exclusive suites offer direct access to the soft white sands of our private beach, allowing you to experience true paradise just steps from your door.

Our Beachfront Suites feature spacious layouts with separate living areas, providing ample space to relax and entertain. The private terrace opens directly onto the beach, creating a seamless connection between your luxurious accommodation and the natural beauty of our tropical paradise.',
  550,
  75,
  807,
  'King-sized bed',
  'Max 2 adults',
  'Beachfront'
),
(
  'Garden View Family Room',
  'garden-view-family',
  'Perfect for families, these rooms offer ample space and a tranquil view of our lush gardens.',
  'Our Garden View Family Rooms provide the ideal retreat for families seeking comfort, convenience, and connection with nature. Nestled within our lush tropical gardens, these spacious accommodations offer a serene environment where families can relax and create lasting memories.

Designed with families in mind, these rooms feature two comfortable double beds, ample space for children to play, and a private balcony overlooking our meticulously maintained gardens. The soothing green landscapes create a peaceful atmosphere, perfect for unwinding after a day of beach activities and exploration.',
  420,
  55,
  592,
  'Two double beds',
  'Max 2 adults and 2 children',
  'Garden view'
),
(
  'Premium Oceanfront Suite with Plunge Pool',
  'premium-oceanfront-suite',
  'Experience the epitome of luxury. This exclusive suite features a private plunge pool and unparalleled ocean views.',
  'Discover the pinnacle of luxury in our Premium Oceanfront Suite with Plunge Pool. This exclusive accommodation represents the ultimate Shangri La experience, combining unparalleled ocean views, expansive living spaces, and the indulgence of your own private plunge pool.

Upon entering, you''ll be greeted by a stunning panoramic view of the azure ocean through floor-to-ceiling windows. The spacious layout features separate living and dining areas elegantly appointed with designer furnishings and original artwork. Step outside onto your expansive private terrace to find your personal plunge pool overlooking the ocean – the perfect spot for a refreshing dip while enjoying the spectacular sunset.',
  850,
  120,
  1292,
  'King-sized bed',
  'Max 2 adults',
  'Panoramic ocean view'
),
(
  'Accessible Room',
  'accessible-room',
  'Designed for guests with mobility needs, these rooms offer comfort and accessibility features.',
  'Our Accessible Rooms are thoughtfully designed to provide a comfortable, convenient, and luxurious experience for guests with mobility needs. We are committed to ensuring that all our guests can enjoy the beauty and amenities of Shangri La Beach Resort with ease and independence.

These spacious rooms feature wider doorways, accessible bathrooms with roll-in showers and grab bars, and carefully considered layouts to allow for easy navigation. All controls and amenities are positioned at appropriate heights for wheelchair users, ensuring a hassle-free stay.',
  320,
  50,
  538,
  'King-sized bed',
  'Max 2 adults',
  'Resort view'
);

-- Seed data for room amenities
-- Ocean View Deluxe Room amenities
INSERT OR IGNORE INTO room_amenities (room_type_id, amenity)
VALUES 
(1, 'King-sized bed'),
(1, 'Private balcony with ocean view'),
(1, 'En-suite bathroom with rain shower'),
(1, 'Seating area'),
(1, 'Complimentary Wi-Fi'),
(1, 'Flat-screen TV'),
(1, 'Mini-bar'),
(1, 'Air conditioning'),
(1, 'Luxury toiletries'),
(1, 'In-room safe'),
(1, 'Coffee and tea making facilities'),
(1, 'Bathrobes and slippers'),
(1, 'Turndown service');

-- Beachfront Suite amenities
INSERT OR IGNORE INTO room_amenities (room_type_id, amenity)
VALUES 
(2, 'King-sized bed'),
(2, 'Separate living area'),
(2, 'Private terrace with direct beach access'),
(2, 'En-suite bathroom with soaking tub and separate shower'),
(2, 'Dining area'),
(2, 'Complimentary Wi-Fi'),
(2, 'Multiple flat-screen TVs'),
(2, 'Mini-bar'),
(2, 'Air conditioning'),
(2, 'Luxury toiletries'),
(2, 'In-room safe'),
(2, 'Coffee and tea making facilities'),
(2, 'Bathrobes and slippers'),
(2, 'Turndown service'),
(2, 'Outdoor loungers'),
(2, 'Priority restaurant reservations');

-- Garden View Family Room amenities
INSERT OR IGNORE INTO room_amenities (room_type_id, amenity)
VALUES 
(3, 'Two double beds'),
(3, 'Private balcony with garden view'),
(3, 'En-suite bathroom'),
(3, 'Seating area'),
(3, 'Complimentary Wi-Fi'),
(3, 'Flat-screen TV'),
(3, 'Mini-bar'),
(3, 'Air conditioning'),
(3, 'Luxury toiletries'),
(3, 'In-room safe'),
(3, 'Coffee and tea making facilities'),
(3, 'Bathrobes and slippers'),
(3, 'Children''s amenities'),
(3, 'Board games upon request');

-- Premium Oceanfront Suite amenities
INSERT OR IGNORE INTO room_amenities (room_type_id, amenity)
VALUES 
(4, 'King-sized bed'),
(4, 'Separate living and dining areas'),
(4, 'Expansive private terrace with plunge pool and sun loungers'),
(4, 'En-suite bathroom with Jacuzzi tub and separate rain shower'),
(4, 'Butler service upon request'),
(4, 'Complimentary premium Wi-Fi'),
(4, 'Multiple smart TVs'),
(4, 'Fully stocked mini-bar'),
(4, 'Premium air conditioning with climate control'),
(4, 'Luxury designer toiletries'),
(4, 'Walk-in closet'),
(4, 'In-room safe'),
(4, 'Espresso machine and tea making facilities'),
(4, 'Premium bathrobes and slippers'),
(4, 'Nightly turndown service with special amenities'),
(4, 'Priority access to all resort facilities'),
(4, 'Complimentary airport transfers'),
(4, 'Welcome champagne');

-- Accessible Room amenities
INSERT OR IGNORE INTO room_amenities (room_type_id, amenity)
VALUES 
(5, 'King-sized bed'),
(5, 'Spacious layout for wheelchair accessibility'),
(5, 'Accessible bathroom with grab bars and roll-in shower'),
(5, 'Lowered amenities'),
(5, 'Visual and auditory alert systems'),
(5, 'Complimentary Wi-Fi'),
(5, 'Flat-screen TV'),
(5, 'Mini-bar at accessible height'),
(5, 'Air conditioning with accessible controls'),
(5, 'Luxury toiletries'),
(5, 'In-room safe'),
(5, 'Coffee and tea making facilities at accessible height'),
(5, 'Wide doorways'),
(5, 'Ground floor location'),
(5, 'Close proximity to elevator and resort facilities');

-- Seed data for room images
INSERT OR IGNORE INTO room_images (room_type_id, image_url, display_order)
VALUES 
-- Ocean View Deluxe Room
(1, '/assets/images/hotel-room1.webp', 1),

-- Beachfront Suite
(2, '/assets/images/hotel-room2.webp', 1),

-- Garden View Family Room
(3, '/assets/images/hotel-room3.webp', 1),

-- Premium Oceanfront Suite
(4, '/assets/images/hotel-room4.webp', 1),

-- Accessible Room (using hotel-room1.webp as base)
(5, '/assets/images/hotel-room1.webp', 1);

-- Seed spa categories data
INSERT OR IGNORE INTO spa_categories (name, description) VALUES 
('Massages', 'Relaxing massage treatments to release tension and promote relaxation'),
('Facials', 'Rejuvenating treatments for the face that cleanse, exfoliate and nourish the skin'),
('Body Treatments', 'Full-body treatments designed to exfoliate, hydrate, and rejuvenate'),
('Nail Services', 'Manicure and pedicure treatments for beautiful hands and feet'),
('Enhancements', 'Add-on services to complement your spa experience'),
('Wellness', 'Yoga, meditation, and other wellness activities for mind and body');

-- Seed spa services data
-- Massages
INSERT OR IGNORE INTO spa_services (category_id, name, description, duration, price, featured, image_url) VALUES 
(1, 'Shangri La Signature Massage', 'A customized massage using a blend of techniques to release tension and promote deep relaxation.', '90 minutes', 250, 1, '/src/assets/images/pexels-cottonbro-studio-3998013.webp'),
(1, 'Deep Tissue Massage', 'Targeted massage to relieve chronic muscle tension and pain.', '60 minutes', 180, 0, '/src/assets/images/pexels-cottonbro-studio-3997989.webp'),
(1, 'Hot Stone Massage', 'Soothing massage using warm basalt stones to melt away stress and improve circulation.', '75 minutes', 220, 0, '/src/assets/images/pexels-shvets-production-7525304.webp'),
(1, 'Aromatherapy Massage', 'Relaxing massage using essential oils to enhance mood and well-being.', '60 minutes', 190, 0, '/src/assets/images/pexels-cottonbro-studio-3997993.webp'),
(1, 'Swedish Massage', 'A classic relaxation massage.', '60 minutes', 170, 0, '/src/assets/images/pexels-karolina-grabowska-4506178.webp'),
(1, 'Couples Massage', 'Relax with a partner in a private room.', '60 Minutes', 350, 0, '/src/assets/images/pexels-cottonbro-studio-4056534.webp');

-- Facials
INSERT OR IGNORE INTO spa_services (category_id, name, description, duration, price, featured, image_url) VALUES 
(2, 'Shangri La Radiance Facial', 'A luxurious facial tailored to your skin type, leaving your complexion glowing.', '75 minutes', 210, 1, '/src/assets/images/pexels-karolina-grabowska-4239013.webp'),
(2, 'Hydrating Facial', 'Deeply nourishing facial to replenish moisture and restore skin''s vitality.', '60 minutes', 180, 0, '/src/assets/images/pexels-shvets-production-7525153.webp'),
(2, 'Anti-Aging Facial', 'Advanced facial treatment to reduce fine lines and wrinkles.', '90 minutes', 270, 0, '/src/assets/images/pexels-anna-tarazevich-5599644.webp'),
(2, 'Purifying Facial', 'Cleansing facial designed to remove impurities and leave a fresh feeling.', '60 minutes', 160, 0, '/src/assets/images/pexels-karolina-grabowska-4202325.webp');

-- Body Treatments
INSERT OR IGNORE INTO spa_services (category_id, name, description, duration, price, featured, image_url) VALUES 
(3, 'Sea Salt Body Scrub', 'Exfoliating treatment to remove dead skin cells and reveal smoother skin.', '45 minutes', 150, 0, '/src/assets/images/pexels-cottonbro-studio-3997381.webp'),
(3, 'Tropical Body Wrap', 'Hydrating and nourishing body wrap using natural ingredients.', '60 minutes', 200, 1, '/src/assets/images/pexels-anete-lusina-5240644.webp'),
(3, 'Sun Relief Wrap', 'Soothing treatment to cool and hydrate skin after sun exposure.', '60 Minutes', 170, 0, '/src/assets/images/pexels-breakingpic-3057.webp');

-- Nail Services
INSERT OR IGNORE INTO spa_services (category_id, name, description, duration, price, featured, image_url) VALUES 
(4, 'Shangri La Deluxe Manicure', 'Luxurious hand and nail treatment with premium products.', '60 minutes', 90, 0, '/src/assets/images/pexels-cottonbro-studio-3997304.webp'),
(4, 'Shangri La Deluxe Pedicure', 'Revitalizing foot and nail treatment with exfoliation and massage.', '75 minutes', 110, 0, '/src/assets/images/pexels-cottonbro-studio-3997318.webp'),
(4, 'Classic Manicure', 'Traditional nail care and polish application.', '45 minutes', 70, 0, '/src/assets/images/pexels-breakingpic-3081.webp'),
(4, 'Classic Pedicure', 'Traditional foot care, exfoliation, and polish application.', '60 minutes', 90, 0, '/src/assets/images/pexels-cottonbro-studio-3997319.webp');

-- Enhancements
INSERT OR IGNORE INTO spa_services (category_id, name, description, duration, price, featured, image_url) VALUES 
(5, 'Scalp Massage', 'Relaxing scalp massage to release tension and promote relaxation.', '15 minutes', 40, 0, '/src/assets/images/pexels-anna-shvets-5069432.webp'),
(5, 'Eye Treatment', 'Soothing treatment to reduce puffiness and dark circles.', '15 minutes', 35, 0, '/src/assets/images/pexels-moose-photos-1029894.webp'),
(5, 'Foot Reflexology', 'Pressure point massage on the feet to promote overall wellness.', '15 minutes', 40, 0, '/src/assets/images/pexels-andrea-piacquadio-3760358.webp');

-- Wellness
INSERT OR IGNORE INTO spa_services (category_id, name, description, duration, price, featured, image_url) VALUES 
(6, 'Yoga Session (Group)', 'Guided yoga session to improve flexibility, strength, and mental clarity.', '60 minutes', 50, 0, '/src/assets/images/pexels-andrea-piacquadio-917653.webp'),
(6, 'Yoga Session (Private)', 'Private guided yoga session customized to your needs and level.', '60 minutes', 120, 0, '/src/assets/images/pexels-andrea-piacquadio-917653.webp'),
(6, 'Meditation Session (Group)', 'Guided meditation to promote relaxation and mindfulness.', '30 minutes', 40, 0, '/src/assets/images/pexels-katerina-holmes-5905700.webp'),
(6, 'Meditation Session (Private)', 'Private guided meditation tailored to your personal goals.', '30 minutes', 100, 1, '/src/assets/images/pexels-katerina-holmes-5905700.webp');

-- Sample spa appointments
INSERT OR IGNORE INTO spa_appointments (
  booking_reference, 
  service_id, 
  appointment_date, 
  appointment_time, 
  guest_name, 
  guest_email, 
  guest_phone, 
  special_requests, 
  status, 
  price
) VALUES 
('SPA-20240422-001', 1, '2024-04-25', '10:00 AM', 'Emma Johnson', 'emma.j@example.com', '555-123-4567', 'Allergic to lavender oil', 'confirmed', 250),
('SPA-20240422-002', 7, '2024-04-26', '2:00 PM', 'Michael Brown', 'michael.b@example.com', '555-987-6543', NULL, 'confirmed', 210),
('SPA-20240422-003', 12, '2024-04-24', '11:00 AM', 'Sarah Wilson', 'sarah.w@example.com', '555-456-7890', 'First-time spa visitor', 'confirmed', 200),
('SPA-20240422-004', 5, '2024-04-23', '3:00 PM', 'David Miller', 'david.m@example.com', '555-789-0123', 'Prefer male therapist', 'confirmed', 170),
('SPA-20240422-005', 22, '2024-04-27', '9:00 AM', 'Olivia Davis', 'olivia.d@example.com', '555-234-5678', 'Beginner level', 'confirmed', 100);
