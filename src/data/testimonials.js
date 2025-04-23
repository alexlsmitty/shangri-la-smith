/**
 * Local testimonials data
 * This file provides static testimonial data to be used when the API is unavailable
 */

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    location: "New York, USA",
    rating: 5,
    text: "Our stay at Shangri La was absolutely perfect! The service was impeccable, the food was delicious, and the views were breathtaking. We especially loved relaxing by the infinity pool. We can't wait to return!",
    category: "Overall Experience",
    featured: 1,
    image_url: "/images/testimonials/guest1.webp",
    created_at: "2025-03-15T14:23:00.000Z"
  },
  {
    id: 2,
    name: "John B.",
    location: "London, UK",
    rating: 5,
    text: "The beachfront suite was amazing! Waking up to the sound of the waves and stepping right onto the sand was incredible. The resort offered so many activities, we never had a dull moment. Highly recommend the snorkeling!",
    category: "Accommodations",
    featured: 1,
    image_url: "/images/testimonials/guest2.webp",
    created_at: "2025-03-10T09:45:00.000Z"
  },
  {
    id: 3,
    name: "Emily K.",
    location: "Toronto, Canada",
    rating: 5,
    text: "We traveled with our two young children, and the Kids' Club was a lifesaver! The staff were fantastic, and our kids had a blast. This allowed us some much-needed relaxation time. The resort is very family-friendly.",
    category: "Family Experience",
    featured: 1,
    image_url: "/images/testimonials/guest3.webp",
    created_at: "2025-02-28T16:30:00.000Z"
  },
  {
    id: 4,
    name: "David L.",
    location: "Sydney, Australia",
    rating: 5,
    text: "The spa experience was divine. The therapists were skilled, and the atmosphere was so peaceful. It was the perfect way to unwind and de-stress. We left feeling completely rejuvenated.",
    category: "Spa Services",
    featured: 0,
    image_url: "/images/testimonials/guest4.webp",
    created_at: "2025-02-22T11:15:00.000Z"
  },
  {
    id: 5,
    name: "Jessica P.",
    location: "Miami, USA",
    rating: 5,
    text: "From the moment we arrived, the staff made us feel welcome and well taken care of. The attention to detail was outstanding. Shangri La truly lives up to its name - a little slice of paradise!",
    category: "Overall Experience",
    featured: 0,
    image_url: "/images/testimonials/guest5.webp",
    created_at: "2025-02-15T13:40:00.000Z"
  },
  {
    id: 6,
    name: "Michael R.",
    location: "Berlin, Germany",
    rating: 4,
    text: "Beautiful resort with excellent facilities. The ocean view from our room was spectacular. Service was generally good, though occasionally slow during peak dining hours. The beach is pristine and well-maintained.",
    category: "Accommodations",
    featured: 0,
    image_url: "/images/testimonials/guest6.webp",
    created_at: "2025-02-08T10:20:00.000Z"
  },
  {
    id: 7,
    name: "Anna T.",
    location: "Paris, France",
    rating: 5,
    text: "The culinary experience at Shangri La was outstanding. Each restaurant offered something unique, but the Beach House was particularly exceptional. The seafood was fresh and beautifully prepared. A paradise for food lovers!",
    category: "Dining",
    featured: 0,
    image_url: "/images/testimonials/guest7.webp",
    created_at: "2025-01-30T19:15:00.000Z"
  },
  {
    id: 8,
    name: "Robert K.",
    location: "Chicago, USA",
    rating: 4,
    text: "We enjoyed the various activities available at the resort. The guided snorkeling tour was a highlight - we saw so many colorful fish and even a sea turtle! The fitness facilities were also top-notch.",
    category: "Activities",
    featured: 0,
    image_url: "/images/testimonials/guest8.webp",
    created_at: "2025-01-25T15:30:00.000Z"
  },
  {
    id: 9,
    name: "Sofia M.",
    location: "Barcelona, Spain",
    rating: 5,
    text: "Our honeymoon at Shangri La was everything we dreamed of and more. The premium oceanfront suite was pure luxury. The private plunge pool was perfect for romantic evenings. The staff went above and beyond to make our stay special.",
    category: "Special Occasions",
    featured: 0,
    image_url: "/images/testimonials/guest9.webp",
    created_at: "2025-01-18T12:45:00.000Z"
  },
  {
    id: 10,
    name: "James W.",
    location: "Tokyo, Japan",
    rating: 5,
    text: "The landscape and architecture of the resort blend perfectly with the natural surroundings. The infinity pool overlooking the ocean is breathtaking. I particularly enjoyed the sunrise yoga sessions on the beach.",
    category: "Amenities",
    featured: 0,
    image_url: "/images/testimonials/guest10.webp",
    created_at: "2025-01-10T08:00:00.000Z"
  }
];

/**
 * Get all available testimonial categories
 * @returns {Array} Array of category names
 */
export const getTestimonialCategories = () => {
  const categories = new Set(testimonials.map(item => item.category));
  return Array.from(categories);
};

export default testimonials;