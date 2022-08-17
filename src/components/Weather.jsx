import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

const city_options = [
  { label: "Kaikki Kaupungit", value: "Kaikki Kaupungit" },
  { label: "Espoo", value: "660129" },
  { label: "Tampere", value: "634963" },
  { label: "Jyväskylä", value: "655194" },
  { label: "Kuopio", value: "650224" },
];

const toDate = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Nocvember",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDate = new Date();
  const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
    months[currentDate.getMonth()]
  }`;
  return date;
};

const toTime = (time) => {
  return moment(time).format("HH:mm");
};

function Weather() {
  const [query] = useState("Kaikki Kaupungit");
  const [weather, setWeather] = useState({
    loading: false,
    data: [],
    error: false,
  });

  useEffect(() => {
    if (query) onCityChange(query);
  }, [query]);

  const allCityIds = ["660129", "634963", "655194", "650224"];
  const onCityChange = async (query) => {
    let cityIds = [query];
    if (query === "Kaikki Kaupungit") {
      cityIds = [...allCityIds];
    }

    /* cityIds.map(id=>(console.log(id))) */
    setWeather({ ...weather, loading: true });
    let citiesData = [];
    for (let id in cityIds) {
      console.log(cityIds[id]);
      console.log("Kaikki Kaupungit");

      const url = "https://api.openweathermap.org/data/2.5/";
      const appid = "c5bfd3e2b3d61d5e3c912b36427d85d8";
      var city = cityIds[id];
      const forecastUrl = `${url}forecast?id=${city}&units=metric&cnt=6&APPID=${appid}`;
      const resp = await axios.get(forecastUrl);
      const data = await resp.data;
      console.log("Data", data);
      citiesData.push(data);
    }

    setWeather({ data: citiesData, loading: false, error: false });
  };

  return (
    <div className="p-10">
      <div className="card mt-3">
        <h1 className="app-name">
          Säätutka<span>🌤</span>
        </h1>
      </div>
      <div className="card mt-4">
        <select
          className="card-body dark small-text"
          onChange={(event) => onCityChange(event.target.value)}
        >
          {city_options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {weather.loading && (
        <>
          <br />
          <br />
          <Loader type="Oval" color="black" height={100} width={100} />
        </>
      )}
      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ "font-size": "20px" }}> Sorry, City not found</span>
          </span>
        </>
      )}
      <br />
      <br />
      {weather.data &&
        weather.data.map((cityData) => (
          <div>
            <div className="city-name">
              <h2>
                {cityData.city.name}, <span>{cityData.city.country}</span>
              </h2>
              <p>{cityData.list[0].weather[0].description.toUpperCase()}</p>
            </div>
            <div className="date">
              <span>{toDate()}</span>
              <br />
              <span>{toTime(cityData.list[0].dt_txt)}</span>
            </div>
            <div className="icon-temp">
              <img
                className=""
                src={`https://openweathermap.org/img/wn/${cityData.list[0].weather[0].icon}@2x.png`}
                alt={cityData.list[0].weather[0].description}
              />
              {Math.round(cityData.list[0].main.temp)}
              <sup className="deg">&deg;C</sup>
            </div>
            <div className="des-wind">
              <p>Wind Speed: {cityData.list[0].wind.speed}m/s</p>
            </div>

            <div className="card-group">
              {[1, 2, 3, 4, 5].map((id) => (
                <div className="card">
                  <div className="sub_date">
                    <span>{toTime(cityData.list[id].dt_txt)}</span>
                  </div>
                  <div className="icon-temp-sub">
                    <img
                      className=""
                      src={`https://openweathermap.org/img/wn/${cityData.list[id].weather[0].icon}@2x.png`}
                      alt={cityData.list[id].weather[0].description}
                    />
                    {Math.round(cityData.list[id].main.temp)}
                    <sup className="deg_sub">&deg;C</sup>
                  </div>
                  <div className="card-footer">
                    <div className="des-wind-sub">
                      {/* <p>{cityData.list[1].weather[0].description.toUpperCase()}</p> */}
                      <p> {cityData.list[id].wind.speed}m/s</p>
                      <p> {cityData.list[id].main.humidity}%</p>
                      <p> {cityData.list[id].pop}mm</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Weather;
