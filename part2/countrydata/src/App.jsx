import axios from 'axios'
import { useState, useEffect } from 'react'

const apiKey = import.meta.env.VITE_WEATHER_KEY

const DisplayWeather = ({weather, filteredCountries}) => {
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    if (weather){
      return (
        <div>
          <h2>Weather in {country.capital}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <img src = {`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}></img>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )
    }
    else{
      return <p>Weather data not available</p>
    }
  }
}

const DisplayCountries = ({countries, filter, setFilter, filteredCountries}) => {
  if (filter === '') {
    return <p>Type something to search for countries</p>
  }
  
  if (filteredCountries.length > 10) {
    return <p>Too many matches, please be more specific</p>
  }
  else if (filteredCountries.length !== 1){
    return (
      <ul>
        {filteredCountries.map(country => 
          <li key={country.name.common}>
            {country.name.common} <button onClick={()=>setFilter(country.name.common)}>Show details</button>
          </li>
        )}
      </ul>
    )
  }
  else {
    const country = filteredCountries[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png}/>
      </div>
    )
  }
}

const App = () => {
  const apiURL = 'https://studies.cs.helsinki.fi/restcountries/api'
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get(`${apiURL}/all`)
      .then(response => {
        setCountries(response.data)
        console.log(response.data.length)
      })
  }, [])
  
  useEffect(() => {
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    setFilteredCountries(filteredCountries)
    console.log(filteredCountries.length)
    if (filteredCountries.length === 1) {
      const country = filteredCountries[0]
      const capital = country.capital
      const lat = country.capitalInfo.latlng[0]
      const lon = country.capitalInfo.latlng[1]
      console.log({ lat, lon })
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => {
          console.log(response.data)
          setWeather(response.data)
    })
    }

  }, [filter])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      Find countries: <input value={filter} onChange={handleFilterChange}/> 
      <DisplayCountries countries={countries} filter={filter} setFilter={setFilter} filteredCountries={filteredCountries} />
      <DisplayWeather weather={weather} filteredCountries={filteredCountries}/>
    </div>
  )
}

export default App