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

-- Sample spa appointments (for demonstration purposes)
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
