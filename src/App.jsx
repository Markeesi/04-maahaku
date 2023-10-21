import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [value, setValue] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

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
  const showDetails = (country) => {
    setSelectedCountry(country);
  };

  const closeDetails = () => {
    setSelectedCountry(null);
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
                  <br/>
                  <button onClick={closeDetails}>Close</button>
                </div>
                
              ) : (
                filteredCountries.map((country, index) => (
                  <div key={index}>
                    <h2>
                      {country.name.common}
                      <button onClick={() => showDetails(country)}>Show</button>
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