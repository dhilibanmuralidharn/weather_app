import { useEffect, useState } from "react";
import "./App.css";
import Current from "./components/Current";
import ForeCast from "./components/ForeCast";

const autoCompleteURL =
  "https://api.weatherapi.com/v1/search.json?key=8dced875ef6341079d884903240408&q=";

const weatherURL = (
  city
) => `https://api.weatherapi.com/v1/forecast.json?key=8dced875ef6341079d884903240408&q=${city}&days=7&aqi=no&alerts=no
`;

function App() {
  const [city, setCity] = useState("");
  const [clicked, setClicked] = useState(false);
  const [current, setCurrent] = useState();
  const [forecast, setForecast] = useState();
  const [location, setLocation] = useState("");
  const [citySuggestion, setCitySuggestion] = useState([]);

  const handleClick = async (clickedCity) => {
    setCity(clickedCity);
    setClicked(true);

    const resp = await fetch(weatherURL(city));
    const data = await resp.json();
    setCurrent(data.current);
    setForecast(data.forecast);
    setLocation(data.location.name);
  };

  useEffect(() => {
    const getDataAfterTimeout = setTimeout(() => {
      const fetchCitySuggestion = async () => {
        const resp = await fetch(autoCompleteURL + city);
        const data = await resp.json();
        const citySuggestionData = data.map(
          (curData) => `${curData.name}, ${curData.region}, ${curData.country}`
        );
        setCitySuggestion(citySuggestionData);
      };
      if (!clicked && city.length > 2) {
        fetchCitySuggestion();
      } else {
        setCitySuggestion([]);
        setClicked(false);
      }
    }, 1000);

    return () => clearTimeout(getDataAfterTimeout);
  }, [city]);

  return (
    <div className="App">
      <div className="header">
        <b>Weather App</b>
      </div>
      <div className="app_body">
        <input
          type="text"
          className="citytextbox"
          placeholder="Enter the city name"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        {citySuggestion.length > 0 && (
          <div className="suggestionWrapper">
            {citySuggestion.map((curCity) => (
              <div className="suggestion" onClick={() => handleClick(curCity)}>
                {curCity}
              </div>
            ))}
          </div>
        )}
        {current && <Current current={current} city={location} />}
        {forecast && <ForeCast forecast={forecast} city={location} />}
      </div>
    </div>
  );
}

export default App;
