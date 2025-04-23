-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  category TEXT NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT DEFAULT '/src/assets/images/default-avatar.webp',
  featured INTEGER DEFAULT 0,  -- 0 = false, 1 = true
  approved INTEGER DEFAULT 0,  -- 0 = pending, 1 = approved, 2 = rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for filtering and sorting testimonials
CREATE INDEX IF NOT EXISTS idx_testimonials_rating_date 
ON testimonials (rating, created_at);

-- Index for searching approved testimonials 
CREATE INDEX IF NOT EXISTS idx_testimonials_approved 
ON testimonials (approved, featured);

-- Sample testimonials data
INSERT OR IGNORE INTO testimonials (
  name, 
  email, 
  location, 
  rating, 
  category, 
  text, 
  image_url, 
  featured, 
  approved
) VALUES 
(
  'Sarah M.', 
  'sarah.m@example.com', 
  'New York, USA', 
  5, 
  'Couples', 
  'Our stay at Shangri La was absolutely perfect! The service was impeccable, the food was delicious, and the views were breathtaking. We especially loved relaxing by the infinity pool. We can''t wait to return!', 
  '/src/assets/images/testimonial-1.webp', 
  1, 
  1
),
(
  'John B.', 
  'john.b@example.com', 
  'London, UK', 
  5, 
  'Adventure', 
  'The beachfront suite was amazing! Waking up to the sound of the waves and stepping right onto the sand was incredible. The resort offered so many activities, we never had a dull moment. Highly recommend the snorkeling!', 
  '/src/assets/images/testimonial-2.webp', 
  1, 
  1
),
(
  'Emily K.', 
  'emily.k@example.com', 
  'Toronto, Canada', 
  5, 
  'Family', 
  'We traveled with our two young children, and the Kids'' Club was a lifesaver! The staff were fantastic, and our kids had a blast. This allowed us some much-needed relaxation time. The resort is very family-friendly.', 
  '/src/assets/images/testimonial-3.webp', 
  1, 
  1
),
(
  'David L.', 
  'david.l@example.com', 
  'Sydney, Australia', 
  5, 
  'Spa & Wellness', 
  'The spa experience was divine. The therapists were skilled, and the atmosphere was so peaceful. It was the perfect way to unwind and de-stress. We left feeling completely rejuvenated.', 
  '/src/assets/images/testimonial-4.webp', 
  0, 
  1
),
(
  'Jessica P.', 
  'jessica.p@example.com', 
  'Miami, USA', 
  5, 
  'Couples', 
  'From the moment we arrived, the staff made us feel welcome and well taken care of. The attention to detail was outstanding. Shangri La truly lives up to its name - a little slice of paradise!', 
  '/src/assets/images/testimonial-5.webp', 
  0, 
  1
),
(
  'Michael R.', 
  'michael.r@example.com', 
  'Chicago, USA', 
  4, 
  'Couples', 
  'The beachfront view from our room was spectacular. The room was spacious and comfortable. Service was excellent, though the restaurant was sometimes crowded during peak hours. Overall, a wonderful experience.', 
  '/src/assets/images/testimonial-6.webp', 
  0, 
  1
),
(
  'Sofia G.', 
  'sofia.g@example.com', 
  'Madrid, Spain', 
  5, 
  'Special Occasions', 
  'We celebrated our anniversary at Shangri La and it was beyond perfect. The staff arranged a private dinner on the beach with candles and flowers. Utterly romantic and a memory we will cherish forever.', 
  '/src/assets/images/testimonial-7.webp', 
  0, 
  1
),
(
  'Robert T.', 
  'robert.t@example.com', 
  'Berlin, Germany', 
  4, 
  'Adventure', 
  'The resort is beautifully designed with attention to every detail. The water sports activities were the highlight of our trip - excellent equipment and instructors. Would have liked more vegetarian options in the restaurants.', 
  '/src/assets/images/testimonial-8.webp', 
  0, 
  1
),
(
  'Olivia H.', 
  'olivia.h@example.com', 
  'Vancouver, Canada', 
  5, 
  'Spa & Wellness', 
  'We came for a yoga retreat and it exceeded all expectations. The meditation sessions on the beach at sunrise were magical. The healthy food options were delicious and creative. Perfect wellness vacation.', 
  '/src/assets/images/testimonial-9.webp', 
  1, 
  1
),
(
  'Daniel K.', 
  'daniel.k@example.com', 
  'Melbourne, Australia', 
  4, 
  'Adventure', 
  'The fishing excursion arranged by the resort was incredible! Caught some amazing fish and the guide was knowledgeable and fun. The only minor issue was that Wi-Fi was spotty in some areas of the resort.', 
  '/src/assets/images/testimonial-10.webp', 
  0, 
  1
),
(
  'Jennifer W.', 
  'jennifer.w@example.com', 
  'Seattle, USA', 
  5, 
  'Family', 
  'Our family of five had an amazing time! The interconnected rooms were perfect, and there were activities for all ages. The kids loved the waterslides and beach games while we enjoyed the adults-only pool area.', 
  '/src/assets/images/testimonial-11.webp', 
  0, 
  1
),
(
  'Thomas N.', 
  'thomas.n@example.com', 
  'Paris, France', 
  5, 
  'Dining', 
  'The culinary experience at Shangri La was extraordinary. Each restaurant offered unique and exquisite flavors. The cooking class with the head chef was a highlight - we still make those recipes at home!', 
  '/src/assets/images/testimonial-12.webp', 
  0, 
  1
);