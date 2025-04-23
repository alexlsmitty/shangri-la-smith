-- Room Types
INSERT OR IGNORE INTO room_types (id, name, slug, description, price, capacity, featured) VALUES
(1, 'Ocean View Deluxe Room', 'ocean-view-deluxe', 'Indulge in stunning panoramic views of the ocean from your private balcony. These rooms offer a perfect blend of comfort and style.', 350, 2, 1),
(2, 'Beachfront Suite', 'beachfront-suite', 'Step directly onto the sand from your spacious suite. Enjoy the ultimate beachfront experience with added luxury and privacy.', 550, 2, 1),
(3, 'Garden View Family Room', 'garden-view-family', 'Perfect for families, these rooms offer ample space and a tranquil view of our lush gardens.', 400, 4, 1),
(4, 'Premium Oceanfront Suite', 'premium-oceanfront-suite', 'Experience the epitome of luxury. This exclusive suite features a private plunge pool and unparalleled ocean views.', 800, 2, 1),
(5, 'Accessible Room', 'accessible-room', 'Designed for guests with mobility needs, these rooms offer comfort and accessibility features.', 300, 2, 0);

-- Room Amenities
INSERT OR IGNORE INTO room_amenities (id, name) VALUES
(1, 'King-sized bed'),
(2, 'Private balcony'),
(3, 'En-suite bathroom'),
(4, 'Rain shower'),
(5, 'Seating area'),
(6, 'Wi-Fi'),
(7, 'Flat-screen TV'),
(8, 'Mini-bar'),
(9, 'Direct beach access'),
(10, 'Separate living area'),
(11, 'Soaking tub'),
(12, 'Multiple TVs'),
(13, 'Private plunge pool'),
(14, 'Butler service'),
(15, 'Premium Wi-Fi'),
(16, 'Accessible bathroom'),
(17, 'Roll-in shower'),
(18, 'Visual alerts'),
(19, 'Auditory alerts'),
(20, 'Two double beds');

-- Room Type Amenities
INSERT OR IGNORE INTO room_type_amenities (room_type_id, amenity_id) VALUES
-- Ocean View Deluxe
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
-- Beachfront Suite
(2, 1), (2, 9), (2, 10), (2, 3), (2, 11), (2, 4), (2, 6), (2, 12), (2, 8),
-- Garden View Family
(3, 20), (3, 2), (3, 3), (3, 5), (3, 6), (3, 7), (3, 8),
-- Premium Oceanfront
(4, 1), (4, 10), (4, 13), (4, 3), (4, 11), (4, 4), (4, 14), (4, 15), (4, 12), (4, 8),
-- Accessible Room
(5, 1), (5, 16), (5, 17), (5, 18), (5, 19), (5, 6), (5, 7);

-- Spa Categories
INSERT OR IGNORE INTO spa_categories (id, name) VALUES
(1, 'Massages'),
(2, 'Facials'),
(3, 'Body Treatments'),
(4, 'Nail Services'),
(5, 'Enhancements'),
(6, 'Wellness');

-- Spa Services
INSERT OR IGNORE INTO spa_services (id, name, category_id, description, duration, price, featured) VALUES
(1, 'Shangri La Signature Massage', 1, 'A customized massage using a blend of techniques to release tension and promote deep relaxation.', '90 minutes', 250, 1),
(2, 'Deep Tissue Massage', 1, 'Targeted massage to relieve chronic muscle tension and pain.', '60 minutes', 180, 0),
(3, 'Hot Stone Massage', 1, 'Soothing massage using warm basalt stones to melt away stress and improve circulation.', '75 minutes', 220, 0),
(4, 'Aromatherapy Massage', 1, 'Relaxing massage using essential oils to enhance mood and well-being.', '60 minutes', 190, 0),
(5, 'Swedish Massage', 1, 'A classic relaxation massage.', '60 minutes', 170, 0),
(6, 'Couples Massage', 1, 'Relax with a partner in a private room.', '60 minutes', 350, 0),
(7, 'Shangri La Radiance Facial', 2, 'A luxurious facial tailored to your skin type, leaving your complexion glowing.', '75 minutes', 210, 1),
(8, 'Hydrating Facial', 2, 'Deeply nourishing facial to replenish moisture and restore skin\'s vitality.', '60 minutes', 180, 0),
(9, 'Anti-Aging Facial', 2, 'Advanced facial treatment to reduce fine lines and wrinkles.', '90 minutes', 270, 0),
(10, 'Purifying Facial', 2, 'Cleansing facial designed to remove impurities and leave a fresh feeling.', '60 minutes', 160, 0),
(11, 'Sea Salt Body Scrub', 3, 'Exfoliating treatment to remove dead skin cells and reveal smoother skin.', '45 minutes', 150, 0),
(12, 'Tropical Body Wrap', 3, 'Hydrating and nourishing body wrap using natural ingredients.', '60 minutes', 200, 1),
(13, 'Sun Relief Wrap', 3, 'Soothing treatment to cool and hydrate skin after sun exposure.', '60 minutes', 170, 0),
(14, 'Shangri La Deluxe Manicure', 4, 'Luxury manicure treatment with hand massage.', '60 minutes', 90, 0),
(15, 'Shangri La Deluxe Pedicure', 4, 'Luxury pedicure treatment with foot massage.', '75 minutes', 110, 0),
(16, 'Classic Manicure', 4, 'Essential nail care and polish.', '45 minutes', 70, 0),
(17, 'Classic Pedicure', 4, 'Essential foot care and polish.', '60 minutes', 90, 0),
(18, 'Scalp Massage', 5, 'Relaxing scalp massage add-on.', '15 minutes', 40, 0),
(19, 'Eye Treatment', 5, 'Soothing eye treatment add-on.', '15 minutes', 35, 0),
(20, 'Foot Reflexology', 5, 'Pressure point foot massage add-on.', '15 minutes', 40, 0),
(21, 'Yoga Session (Group)', 6, 'Group yoga class with certified instructor.', '60 minutes', 50, 0),
(22, 'Yoga Session (Private)', 6, 'Private yoga instruction.', '60 minutes', 120, 0),
(23, 'Meditation Session (Group)', 6, 'Group meditation class.', '30 minutes', 40, 0),
(24, 'Meditation Session (Private)', 6, 'Private meditation instruction.', '30 minutes', 100, 0);

-- Testimonials
INSERT OR IGNORE INTO testimonials (id, name, content, rating, date_posted, category) VALUES
(1, 'Sarah M.', 'Our stay at Shangri La was absolutely perfect! The service was impeccable, the food was delicious, and the views were breathtaking. We especially loved relaxing by the infinity pool. We can\'t wait to return!', 5, '2024-02-15', 'resort'),
(2, 'John B.', 'The beachfront suite was amazing! Waking up to the sound of the waves and stepping right onto the sand was incredible. The resort offered so many activities, we never had a dull moment. Highly recommend the snorkeling!', 5, '2024-01-20', 'accommodation'),
(3, 'Emily K.', 'We traveled with our two young children, and the Kids\' Club was a lifesaver! The staff were fantastic, and our kids had a blast. This allowed us some much-needed relaxation time. The resort is very family-friendly.', 4, '2024-03-05', 'family'),
(4, 'David L.', 'The spa experience was divine. The therapists were skilled, and the atmosphere was so peaceful. It was the perfect way to unwind and de-stress. We left feeling completely rejuvenated.', 5, '2024-02-28', 'spa'),
(5, 'Jessica P.', 'From the moment we arrived, the staff made us feel welcome and well taken care of. The attention to detail was outstanding. Shangri La truly lives up to its name - a little slice of paradise!', 5, '2024-03-12', 'service');