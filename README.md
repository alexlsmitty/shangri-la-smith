# Shangri-La Beach Resort Website

A modern, responsive Vue.js-based website for the Shangri-La Beach Resort, featuring room bookings, spa services, testimonials, and more.

![Shangri-La Beach Resort](./public/favicon.ico)

## 🌴 Overview

The Shangri-La Beach Resort website is a comprehensive platform showcasing the resort's accommodations, amenities, and services. It provides potential guests with detailed information about room options, dining experiences, spa treatments, and activities. The website includes a fully functional booking system for both room reservations and spa appointments.

## 🚀 Features

- **Responsive Design**: Works seamlessly across all devices (320px to 3200px viewport widths)
- **Performance Optimized**: Each page is under 1.8MB including all assets
- **Real-time Weather**: Live weather data for Cancun, Mexico in the header
- **Booking System**: Complete room reservation management
- **Spa Appointments**: Spa service booking functionality
- **User Accounts**: Authentication and profile management
- **Testimonials**: Guest reviews and ratings

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3**: With Composition API
- **Vuetify 3**: Material Design component framework
- **Vue Router**: For navigation
- **Axios**: For API requests
- **Vite**: Build tool and development server
- **SASS**: For enhanced styling

### Backend
- **Express.js**: API server
- **SQLite**: Database with dynamic initialization
- **Vercel Serverless Functions**: For deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/shangri-la-smith.git
   cd shangri-la-smith
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize the database**:
   ```bash
   npm run init-db
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173/

## 🗃️ Database Structure

The application uses SQLite with the following tables:

- **room_types**: Details about each room type
- **room_amenities**: Amenities associated with each room type
- **room_images**: Images for each room type
- **bookings**: Room reservation information
- **spa_categories**: Categories of spa services
- **spa_services**: Detailed spa treatment information
- **spa_appointments**: Spa booking records
- **users**: User authentication and profile data

### Database Location

- Development: `./.data/shangri-la.db`
- Production: Created in the Vercel temporary storage on each serverless function execution

### Database Access

- Direct access in development: Use SQLite tools to open `./.data/shangri-la.db`
- API access: Use the provided API endpoints to interact with the database

## 🖥️ API Endpoints

### Room API
- `GET /api/rooms` - Get all room types
- `GET /api/room?slug={roomSlug}` - Get details for a specific room
- `GET /api/availability` - Check room availability

### Booking API
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/my-bookings` - Get user's bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/booking?reference={bookingReference}` - Get booking details
- `PUT /api/booking` - Update a booking

### Spa API
- `GET /api/spa/categories` - Get all spa categories
- `GET /api/spa/services` - Get all spa services
- `GET /api/spa/services/featured` - Get featured spa services
- `GET /api/spa/services/category/{categoryId}` - Get services by category
- `GET /api/spa/services/{serviceId}` - Get specific service details
- `GET /api/spa/appointments/available` - Check appointment availability
- `POST /api/spa/appointments` - Create a new appointment

### Authentication API
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user info
- `POST /api/auth/logout` - User logout

## 📦 Project Structure

```
shangri-la-smith/
├── .data/                # Database storage (development)
├── api/                  # API handlers
├── base-content/         # Content data
├── db/                   # Database schema and seed data
├── public/               # Static assets
├── src/                  # Frontend source code
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Vue components
│   ├── plugins/          # Vue plugins
│   ├── router/           # Vue Router configuration
│   ├── services/         # API services
│   ├── views/            # Page components
│   ├── App.vue           # Main app component
│   └── main.js           # App entry point
├── .env.production       # Production environment variables
├── init-db.js            # Database initialization script
├── server.js             # Express API server
└── vite.config.js        # Vite configuration
```

## 🚀 Deployment

The project is configured for deployment on Vercel with serverless functions:

1. **Setup**:
   - Fork or push this repository to your GitHub account
   - Create a Vercel account and import the GitHub repository
   - Configure the build settings:
     - Build Command: `npm run vercel-build`
     - Output Directory: `dist`
     - Install Command: `npm install`

2. **How It Works**:
   - Frontend static files are served from `/dist`
   - API endpoints run as serverless functions
   - SQLite database initializes on-demand in Vercel's temporary storage
   - The `vercel.json` configuration routes requests appropriately

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run init-db` - Initialize the database
- `npm run start` - Start the Express API server
- `npm run vercel-build` - Build for Vercel deployment
- `npm run check-deployment` - Test production build locally
- `npm run lint` - Lint and fix code issues
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Attributions

- Weather data provided by [OpenWeatherMap API](https://openweathermap.org/api)
- Images sourced from Unsplash and Pexels (individual attribution in the site footer)
- Vue.js and Vuetify for the frontend framework
