import axios from "axios";

const apiKey = import.meta.env.VITE_SOME_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5";

// Define your service functions
const weatherService = {
  getWeatherByCity: (city, country) => {
    const url = `${baseUrl}/weather?q=${city},${country}&appid=${apiKey}`;
    return axios.get(url).then((response) => response.data);
  },
};

export default weatherService;