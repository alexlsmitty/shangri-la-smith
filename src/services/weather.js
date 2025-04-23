import axios from 'axios'

const API_KEY = '4375ee5cec92e6e91f13907e89fce7ba'
const CANCUN_COORDS = { lat: 21.1619, lon: -86.8515 }

export async function getWeather() {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: CANCUN_COORDS.lat,
        lon: CANCUN_COORDS.lon,
        units: 'metric',
        appid: API_KEY,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}
