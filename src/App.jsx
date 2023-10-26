import { useState, useEffect, useRef } from "react";
import weatherService from "./services/weather-api";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const showButtonRef = useRef(null);

  useEffect(() => {
    // Fetch country data when the component mounts
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching country data: " + error);
      });
  }, []);

  useEffect(() => {
    // Filter countries based on the user's input
    if (value) {
      const lowercaseValue = value.toLowerCase();
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(lowercaseValue)
      );
      setFilteredCountries(filtered);

      if (filtered.length === 1) {
        showDetails(filtered[0]);
      }
    } else {
      setFilteredCountries([]);
    }
  }, [value, countries]);

  useEffect(() => {
    setSelectedCountry(null);
    
  }, [value]);


  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };
  const showDetails = (country) => {
    setSelectedCountry(country);
    if (filteredCountries.length > 1 && showButtonRef.current) {
      showButtonRef.current.click();
    }
    // Fetch weather data for the selected country's capital
    weatherService
      .getWeatherByCity(country.capital[0], country.cca)
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data: " + error);
      });
      
  };

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2); // Keep two decimal places
  };

  const closeDetails = () => {
    setSelectedCountry(null);
    setWeatherData(null);
    showButtonRef.current = null;
  };

  return (
    <div>
      <div>
        Country: <input value={value} onChange={handleChange} />
      </div>
      {filteredCountries.length < 10 ? (
        <div>
          {filteredCountries.length === 0 ? (
            <p>No matching countries found.</p>
          ) : (
            <div>
              {selectedCountry ? (
                <div>
                  <h2>{selectedCountry.name.common}</h2>
                  <ul>
                    <li>Capital: {selectedCountry.capital[0]}</li>
                    <li>Population: {selectedCountry.population}</li>
                  </ul>
                  <h3>Languages</h3>
                  <ul>
                    {Object.entries(selectedCountry.languages).map(
                      ([code, name]) => (
                        <li key={code}>{name}</li>
                      )
                    )}
                  </ul>
                  <img
                    src={selectedCountry.flags.svg}
                    alt={`${selectedCountry.name.common} Flag`}
                    style={{
                      maxWidth: "260px", // Set the max width to your desired size
                      maxHeight: "120px", // Set the max height to your desired size
                    }}
                  />
                  <br />
                  <button onClick={closeDetails}>Close</button>
                  {weatherData && (
                    <div>
                      <h3>Weather in {selectedCountry.capital[0]}</h3>
                      <ul>
                        <li>Main: {weatherData.weather[0].main}</li>
                        <li>
                          Description: {weatherData.weather[0].description}
                        </li>
                        <li>Temperature: {kelvinToCelsius(weatherData.main.temp)} Celsius</li>
                        <li>
                          <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt="Weather Icon"
                            style={{ maxWidth: "100px" }}
                          />
                        </li>
                        <li>Wind Speed: {weatherData.wind.speed} m/s</li>
                        {/* Add more weather data here */}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                filteredCountries.map((country, index) => (
                  <div key={index}>
                    <h2>
                      {country.name.common}
                      <button
                        ref={showButtonRef}
                        onClick={() => showDetails(country)}
                      >
                        Show
                      </button>
                    </h2>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Too many matches, please specify another filter.</p>
      )}
    </div>
  );
};

export default App;
