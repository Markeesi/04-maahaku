import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

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
    } else {
      setFilteredCountries([]);
    }
  }, [value, countries]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  return (
    <div>
      <div>
        Country: <input value={value} onChange={handleChange} />
      </div>
      {filteredCountries.length < 5 ? (
        <div>
          {filteredCountries.length === 0 ? (
            <p>No matching countries found.</p>
          ) : (
            <ul>
              {filteredCountries.map((country, index) => (
                <li key={index}>
                  {country.name.common}
                  {filteredCountries.length === 1 ? (
                    <div>
                      Additional Details:
                      <ul>
                        <li>Official Name: {country.name.official}</li>
                        <li>Capital: {country.capital[0]}</li>
                        <li>Population: {country.population}</li>
                        {/* Add more details as needed */}
                      </ul>
                      <img
                      src={country.flags.svg}
                      alt={`${country.name.common} Flag`}
                      style={{
                        maxWidth: '200px', // Set the max width to your desired size
                        maxHeight: '120px', // Set the max height to your desired size
                      }}
                    />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p>Too many matches, please specify another filter.</p>
      )}
    </div>
  );
}
export default App;
