const apiKey="599cc0cd1b9b3031605287f4d2e2a3fe"
        const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

         const searchBox=document.querySelector(".search input");
         const searchBtn=document.querySelector(".search button");
         const weatherIcon=document.querySelector(".weather-icon");
         const bgVideo=document.querySelector("source.video");
         checkWeather("delhi");




        async function checkWeather(city){
            const response=await fetch(apiUrl+city+ `&appid=${apiKey}`);
            var data=await response.json();
            console.log(data);
            document.querySelector(".city").innerHTML=data.name;
            document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°C";
            document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
            document.querySelector(".wind").innerHTML=data.wind.speed +"km/h";
           var status= document.querySelector(".status");

            if(data.weather[0].main=="Clouds"){
                weatherIcon.src="images/clouds.png";
                status.innerHTML="Cloudy";
                bgVideo.src="videos/cloudy.mp4";
        }
        else if(data.weather[0].main=="Clear"){
                weatherIcon.src="images/clear.png";
                status.innerHTML="sunny";
                bgVideo.src="videos/sunny.mp4";
        }
        else if(data.weather[0].main=="Rain"){
                weatherIcon.src="images/rain.png";
                status.innerHTML=data.weather[0].main+"ing";
                bgVideo.src="videos/rainy.mp4";
        }
        else if(data.weather[0].main=="Mist"){
                weatherIcon.src="images/mist.png";
                status.innerHTML=data.weather[0].main+"y";
                bgVideo.src="videos/misty.mp4";
        }
        else if(data.weather[0].main=="Drizzle"){
                weatherIcon.src="images/drizzle.png";
                status.innerHTML="Drizzly";
                bgVideo.src="videos/drizzle.mp4";
        }
    }

       searchBtn.addEventListener("click",()=>{
        checkWeather(searchBox.value);
       })
