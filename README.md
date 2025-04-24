# Shangri-La Beach Resort Website

A modern, responsive Vue.js-based website for the Shangri-La Beach Resort, featuring room bookings, spa services, dining options, activities, and testimonials - all with a luxurious tropical paradise theme.

<p align="center">
  <img src="./public/shangri-la-logo.svg" alt="Shangri-La Beach Resort" width="500">
</p>

## 🌴 Overview

The Shangri-La Beach Resort website showcases the resort's luxury accommodations, world-class amenities, and premium services. The site provides potential guests with immersive visual experiences and detailed information about room options, dining venues, spa treatments, and resort activities, featuring a fully functional booking system for both room reservations and spa appointments.

## 🚀 Key Features

- **Fully Responsive Design**: Works seamlessly across all devices from 320px to 3200px viewport widths
- **Performance Optimized**: Each page is under 1.8MB including all assets for fast loading times
- **Real-time Weather**: Live weather data for Cancun, Mexico displayed in the header
- **Room Booking System**: Complete reservation management with date selection and availability checking
- **Spa Appointment Scheduling**: Full spa service catalog with booking functionality
- **User Accounts**: Authentication system for viewing and managing bookings
- **Resort Information**: Comprehensive details on dining options, activities, and amenities

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3**: Utilizing the Composition API with `<script setup>` syntax
- **Vuetify 3**: Material Design component framework
- **Vue Router**: Client-side routing with code splitting
- **Vite**: Fast build tool and development server
- **SASS/SCSS**: Enhanced styling with variables and mixins

### Backend
- **Supabase**: PostgreSQL database with authentication and storage
- **Express.js**: API server for custom endpoints
- **Serverless Functions**: Deployed on Vercel

## 📋 Pages & Features

### Homepage
- Hero section with resort showcase and call-to-action
- Features grid highlighting key amenities
- Room previews with quick booking links
- Testimonials carousel

### Accommodations
- Multiple room types with detailed information
- Image galleries and amenity lists
- Availability checking and booking widgets

### Dining
- Profiles of resort restaurants and lounges
- Menu previews and ambiance photos
- Special dietary accommodations information

### Spa Services
- Complete treatment catalog with pricing
- Appointment booking system
- Wellness program information

### Activities & Excursions
- On-site activities and off-site excursions
- Booking information and photo galleries

### User Account System
- Authentication and profile management
- Booking history and management tools

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alexlsmitty/shangri-la-smith.git
   cd shangri-la-smith
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with Supabase credentials and API keys.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173/

## 🚀 Deployment

The project is configured for deployment on both Vercel and GitHub Pages:

### Vercel Deployment
- Connect GitHub repository to Vercel
- Configure build settings (`npm run build`, output directory: `dist`)
- Add required environment variables

### GitHub Pages Deployment
- The site is deployed via GitHub Actions using the included workflow
- Automatically builds and deploys to GitHub Pages on push to main branch
- Available at [https://alexlsmitty.github.io/shangri-la-smith/](https://alexlsmitty.github.io/shangri-la-smith/)
- To configure GitHub Pages deployment:
  1. Ensure your repository name matches the `base` path in `vite.config.gh-pages.js`
  2. Set up repository secrets for environment variables (Settings > Secrets > Actions):
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_OPENWEATHER_API_KEY`
  3. Push to main branch or manually trigger deployment in Actions tab

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:github` - Build for GitHub Pages deployment
- `npm run check-gh-pages` - Verify GitHub Pages configuration
- `npm run lint` - Lint and fix code issues
- `npm run check-size` - Verify pages meet the 1.8MB size limit
- `npm run preview` - Preview production build locally

## 🙏 Attributions

- Weather data provided by [OpenWeatherMap API](https://openweathermap.org/api)
- Images sourced from [Pexels](https://www.pexels.com/) and original materials provided by the client
- Room, dining, and activity photos used with permission from client-provided materials
- SVG icons from [Material Design Icons](https://materialdesignicons.com/)
- Database services provided by [Supabase](https://supabase.com)
- Built with [Vue.js](https://vuejs.org/) and [Vuetify](https://vuetifyjs.com/)

## 🔄 Update - April 23, 2025

- Fixed GitHub Pages deployment with proper module resolution
- Added enhanced SPA routing with custom 404.html handling
- Updated build configuration to ensure correct asset paths
- Improved script loading with proper Vite path handling
- Added importmap for external dependency resolution
