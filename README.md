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
- **Supabase**: PostgreSQL database service with authentication
- **Vercel Serverless Functions**: For deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account (for database)

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

3. **Set up environment variables**:
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the database**:
   Run the SQL schema in Supabase SQL Editor:
   ```bash
   # Copy the contents of supabase-schema.sql to the Supabase SQL Editor and run
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173/

## 📊 Database Setup

### Supabase Configuration

The application uses Supabase (PostgreSQL) for data storage. Follow these steps to set up your database:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. In the SQL Editor, run the SQL script from `supabase-schema.sql`
4. Copy your project URL and anon key to your `.env` file

### Database Migration

If you have existing data in SQLite that you want to migrate to Supabase:

1. Make sure your SQLite database is initialized and populated
2. Add your service role key to the `.env` file (for migration only)
3. Run the migration script:
   ```bash
   node migrate-to-supabase.js
   ```

### Database Structure

The application uses the following tables:

- **room_types**: Details about each room type
- **room_images**: Images for each room type
- **room_availability**: Availability and pricing for rooms
- **bookings**: Room reservation information
- **spa_categories**: Categories of spa services
- **spa_services**: Detailed spa treatment information
- **spa_appointments**: Spa booking records
- **testimonial_categories**: Categories for testimonials
- **testimonials**: Guest reviews and ratings

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
├── api/                  # API handlers
├── base-content/         # Content data
├── db/                   # Database schema and seed data
├── lib/                  # Utility functions and Supabase client
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
├── .env                  # Environment variables (development)
├── .env.production       # Production environment variables
├── supabase-schema.sql   # Database schema for Supabase
├── migrate-to-supabase.js# Database migration script
├── server.js             # Express API server
└── vite.config.js        # Vite configuration
```

## 🚀 Deployment

The project is configured for deployment on both Vercel and GitHub Pages:

### Vercel Deployment

1. **Setup**:
   - Fork or push this repository to your GitHub account
   - Create a Vercel account and connect to your GitHub repository
   - Configure the build settings in Vercel dashboard:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   
2. **Environment Variables**:
   - Add the following environment variables in Vercel dashboard:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
     - `VITE_OPENWEATHER_API_KEY`: Your OpenWeatherMap API key

3. **Deployment**:
   - Vercel will automatically deploy when you push to the main branch
   - You can also trigger manual deployments from the Vercel dashboard

### GitHub Pages Deployment

1. **Setup**:
   - Ensure your repository is public and named appropriately
   - Build your project: `npm run build`

2. **GitHub Pages Configuration**:
   - Go to your repository Settings > Pages
   - Select the 'GitHub Actions' as the source
   - Create a GitHub Actions workflow file in `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_OPENWEATHER_API_KEY: ${{ secrets.VITE_OPENWEATHER_API_KEY }}

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

3. **Environment Variables**:
   - Add repository secrets in Settings > Secrets and variables > Actions:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
     - `VITE_OPENWEATHER_API_KEY`: Your OpenWeatherMap API key

### Page Size Verification

Before deploying, verify that each page meets the 1.8MB size limit:

1. Build the project: `npm run build`
2. Run the size checker: `npm run check-size`
3. Fix any page size issues if flagged by the checker

### How It Works

- Frontend static files are served from `/dist`
- API endpoints use Supabase direct connections for frontend
- Images are optimized during build process
- The site uses client-side routing with Vue Router
- All pages are kept under 1.8MB as required

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run start` - Start the Express API server
- `npm run check-size` - Check if pages meet the 1.8MB size limit
- `npm run analyze` - Analyze bundle size with detailed reports
- `npm run lint` - Lint and fix code issues
- `npm run format` - Format code with Prettier
- `npm run check-deployment` - Test production build locally
- `npm run vercel-build` - Build specifically for Vercel deployment

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
- Database services provided by [Supabase](https://supabase.com)
- Vue.js and Vuetify for the frontend framework
