<script setup>
import { ref, onMounted } from 'vue'

const weatherData = ref(null)
const loading = ref(true)
const error = ref(null)

// Display a formatted temperature
const formattedTemp = (temp) => {
  return temp ? `${Math.round(temp)}°C` : '--'
}

// Get weather condition icon
const getWeatherIcon = (code) => {
  // Map weather condition codes to Material Design Icons
  if (!code) return 'mdi-weather-partly-cloudy'
  
  const codeStr = code.toString()
  
  // Thunderstorm
  if (codeStr.startsWith('2')) return 'mdi-weather-lightning'
  // Drizzle
  if (codeStr.startsWith('3')) return 'mdi-weather-rainy'
  // Rain
  if (codeStr.startsWith('5')) return 'mdi-weather-pouring'
  // Snow
  if (codeStr.startsWith('6')) return 'mdi-weather-snowy'
  // Atmosphere (fog, haze, etc.)
  if (codeStr.startsWith('7')) return 'mdi-weather-fog'
  // Clear
  if (codeStr === '800') return 'mdi-weather-sunny'
  // Clouds
  if (codeStr.startsWith('80')) return 'mdi-weather-cloudy'
  
  return 'mdi-weather-partly-cloudy'
}

// Get a readable description of weather
const getWeatherDescription = (code, description) => {
  return description ? description.charAt(0).toUpperCase() + description.slice(1) : 'Weather data unavailable'
}

// Fetch weather data for Cancun
const fetchWeatherData = async () => {
  // For demo purposes in development: simulate API response for Cancun
  try {
    loading.value = true
    
    // In production, you'd use something like:
    // const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    // const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Cancun,mx&units=metric&appid=${apiKey}`)
    
    // For development, we'll simulate a response
    setTimeout(() => {
      // Simulated response for Cancun weather
      weatherData.value = {
        main: {
          temp: 29,
          feels_like: 32,
          humidity: 75
        },
        weather: [
          {
            id: 801,
            main: 'Clouds',
            description: 'few clouds'
          }
        ],
        name: 'Cancun'
      }
      loading.value = false
    }, 500)
  } catch (err) {
    console.error('Error fetching weather data:', err)
    error.value = 'Unable to load weather data'
    loading.value = false
  }
}

onMounted(() => {
  fetchWeatherData()
})
</script>

<template>
  <div class="weather-widget">
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <div class="weather-display d-flex align-center" v-bind="props">
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="20"
            width="2"
            color="white"
          ></v-progress-circular>
          
          <template v-else-if="error">
            <v-icon color="white" size="20">mdi-alert-circle-outline</v-icon>
            <span class="ml-1 white--text">{{ error }}</span>
          </template>
          
          <template v-else-if="weatherData">
            <v-icon color="white" size="22" :icon="getWeatherIcon(weatherData.weather[0].id)"></v-icon>
            <span class="ml-1 white--text">{{ formattedTemp(weatherData.main.temp) }}</span>
            <span class="location ml-1 white--text">Cancun</span>
          </template>
        </div>
      </template>
      <div class="pa-2">
        <div v-if="weatherData" class="text-center">
          <div class="text-h6 mb-1">{{ weatherData.name }}</div>
          <div class="mb-2">{{ getWeatherDescription(weatherData.weather[0].id, weatherData.weather[0].description) }}</div>
          <div class="d-flex justify-center">
            <div class="px-2">
              <div class="text-caption">Temp</div>
              <div>{{ formattedTemp(weatherData.main.temp) }}</div>
            </div>
            <div class="px-2">
              <div class="text-caption">Feels Like</div>
              <div>{{ formattedTemp(weatherData.main.feels_like) }}</div>
            </div>
            <div class="px-2">
              <div class="text-caption">Humidity</div>
              <div>{{ weatherData.main.humidity }}%</div>
            </div>
          </div>
        </div>
        <div v-else-if="error" class="text-center pa-2">
          {{ error }}
        </div>
        <div v-else class="text-center pa-2">
          Loading weather data...
        </div>
      </div>
    </v-tooltip>
  </div>
</template>

<style scoped>
.weather-widget {
  display: inline-flex;
  align-items: center;
}

.weather-display {
  padding: 4px 8px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.weather-display:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.location {
  font-size: 0.85rem;
  opacity: 0.8;
}

@media (max-width: 600px) {
  .location {
    display: none;
  }
}
</style>