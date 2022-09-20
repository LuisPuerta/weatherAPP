/*--------- Global variables ---------*/
const body = document.querySelector("#body");

const form = document.querySelector("#form");
const container = document.querySelector(".container");
const show_weather = document.querySelector(".showWeather");

/*--------- Window event listener ---------*/
window.addEventListener("load", () => {
  form.addEventListener("submit", searchWeather);
});

/*--------- Functions ---------*/

//Search for the weather
function searchWeather(e) {
  e.preventDefault();

  //Get country and city
  country = document.querySelector("#country").value;
  city = document.querySelector("#city").value;

  if (country === "" || city === "") {
    // There was a mistake
    showError("Please fill both fields");
    return;
  }

  consultAPI(country, city);
}

//Consulting the weather API
function consultAPI(country, city) {
  const appID = "fa275db5ad3431098b64bb6aa81cb995";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${appID}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.cod === "404") {
        showError("City not found");
        return;
      }
      showWeather(data, city);
    });

  document.querySelector("#city").value = "";
  document.querySelector("#city").focus();
}

//Showing the result in the DOM
function showWeather(data) {
  const {
    name,
    main: { temp, temp_max, temp_min, feels_like, sea_level },
    weather: { 0: description },
  } = data;

  city = city[0].toUpperCase() + city.substring(1);

  // Getting temp from kelvin to centrigrades
  const kelvinToCentigrade = (grades) => parseInt(grades - 273.15);

  const temp_C = kelvinToCentigrade(temp);
  const temp_max_C = kelvinToCentigrade(temp_max);
  const temp_min_C = kelvinToCentigrade(temp_min);

  //Getting the temp level for the card's background
  const temp_level = temp_level_indicator(temp_C);
  console.log(temp_C, temp_level);

  //Declaring variables to pass them as parameters to create the card parameters
  let bg_weather_color;
  let text_weather_color;
  let subtext_weather_color;
  let weather_icon;
  cardParameters = getCardParameters(
    bg_weather_color,
    text_weather_color,
    subtext_weather_color,
    weather_icon,
    temp_level
  );
  console.log(cardParameters);

  // Creating the variable for the new card to be added to the DOM
  results = createWeatherCard(
    cardParameters,
    country,
    city,
    temp_C,
    temp_max_C,
    temp_min_C,
    description
  );

  // Creating an auxiliar var to check if a card is already in the DOM
  const results_exists = document.querySelector(".temp-info");

  // Checking if theres already a card to be replaced or just add a new one
  addCard(results, temp_level);
}

//Obtain the word for the temp level
function temp_level_indicator(temp_C) {
  if (temp_C >= 30) {
    return "hot";
  } else if (temp_C > 20 && temp_C < 30) {
    return "warm";
  } else if (temp_C <= 20 && temp_C > 10) {
    return "cool";
  } else {
    return "cold";
  }
}

//Obtain some of the card parameters in function of their results
function getCardParameters(
  bg_weather_color,
  text_weather_color,
  subtext_weather_color,
  weather_icon,
  temp_level
) {
  if (temp_level == "hot") {
    bg_weather_color = "bg-red-300"; //rgb(252 165 165)
    text_weather_color = "text-neutral-700";
    subtext_weather_color = "text-neutral-800";

    weather_icon = '<i class="fa-brands fa-hotjar fa-2xs"></i>';
  } else if (temp_level == "warm") {
    bg_weather_color = "bg-amber-300"; //rgb(252 211 77)
    text_weather_color = "text-neutral-700";
    subtext_weather_color = "text-neutral-800";

    weather_icon = '<i class="fa-solid fa-mug-hot fa-2xs"></i>';
  } else if (temp_level == "cool") {
    bg_weather_color = "bg-sky-300"; //rgb(125 211 252)
    text_weather_color = "text-neutral-700";
    subtext_weather_color = "text-neutral-800";

    weather_icon = '<i class="fa-solid fa-fan fa-2xs"></i>';
  } else {
    bg_weather_color = "bg-sky-800"; //rgb(7 89 133);
    text_weather_color = "text-neutral-50";
    subtext_weather_color = "text-neutral-150";

    weather_icon = '<i class="fa-solid fa-snowflake fa-2xs"></i>';
  }

  //Creating an object to return it
  cardParameters = {
    background: bg_weather_color,
    text: text_weather_color,
    subtext: subtext_weather_color,

    icon: weather_icon,
  };

  return cardParameters;
}

//Creating the card so it can be added to the DOM
function createWeatherCard(
  cardParameters,
  country,
  city,
  temp_C,
  temp_max_C,
  temp_min_C,
  description
) {
  const results = document.createElement("div");
  results.classList.add("temp-info");
  results.classList.add("m-auto");
  results.classList.add("w-40");
  results.classList.add("font-bold");
  results.innerHTML = `
                        <div class="inline-block m-2 text-center items-center w-40 text-5xl pt-1 rounded opacity-90 ${cardParameters.background} ${cardParameters.text}">
                          <p class="font-semibold text-lg text-left ml-2"> ${country}: ${city} </p>
                          <p class="-mb-2">${temp_C}&deg</p>
                          ${cardParameters.icon}
                          <div class="temp-detail-info flex flex-row m-2 -mt-4 text-xl font-normal ${cardParameters.subtext}">
                            <div class="m-1 w-full"> <p>Min</p> <p>${temp_min_C}&deg</p></div>
                            <div class="m-1 w-full"> <p>Max</p> <p>${temp_max_C}&deg</p></div>

                            <!-- <img src="http://openweathermap.org/img/wn/${description.icon}@2x.png"> -->
                            
                          </div>
                        </div>
                      `;

  return results;
}

//Show errors in DOM
function showError(msg) {
  const alert = document.querySelector(".error-alert");

  if (!alert) {
    // Create alert
    const alert = document.createElement("div");

    alert.classList.add(
      "error-alert",
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-1",
      "text-center"
    );

    alert.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${msg}</span>
        `;

    form.appendChild(alert);

    // Delete alert
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }
}

//Cleaning the previous result
function cleanResults() {
  while (show_weather.firstChild) {
    show_weather.removeChild(show_weather.firstChild);
  }
}

//Adding the card and creating a Spinner
function addCard(results, temp_level) {
  cleanResults();

  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");
  divSpinner.classList.add("mx-auto");
  divSpinner.classList.add("mt-3");
  divSpinner.classList.add("w-10");
  divSpinner.classList.add("h-10");
  divSpinner.innerHTML = `
                      <div class="double-bounce1"></div>
                      <div class="double-bounce2"></div>
    `;

  show_weather.appendChild(divSpinner);

  setTimeout(() => {
    divSpinner.remove();

    // Changing background
    body.removeAttribute("class");
    body.classList.add(`${temp_level}-weather-bg`);
    show_weather.appendChild(results);
  }, 1500);
}
