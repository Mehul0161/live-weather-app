# 🌤️ Live Weather App

A modern, responsive weather application that provides real-time weather information with dynamic theming and beautiful UI/UX.

## ✨ Features

- **Real-time Weather Data**: Get current weather from OpenWeatherMap API
- **Dynamic Theming**: UI automatically adapts to weather conditions and time of day
- **Unit Toggle**: Switch between Celsius (°C) and Fahrenheit (°F)
- **Geolocation**: Use your current location for instant weather updates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Glassmorphism design with smooth transitions and animations
- **Background Videos**: Dynamic video backgrounds based on weather conditions
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 🚀 Live Demo

Open `index.html` in your browser or deploy to any static hosting service.

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **API**: OpenWeatherMap Weather API
- **Styling**: CSS Grid, Flexbox, CSS Variables, Glassmorphism effects
- **Fonts**: Google Fonts (Poppins)

## 📁 Project Structure

```
live-weather-app/
├── index.html          # Main HTML file
├── style.css           # Styles and responsive design
├── script.js           # Weather logic and API integration
├── images/             # Weather condition icons
│   ├── clear.png
│   ├── clouds.png
│   ├── rain.png
│   ├── snow.png
│   ├── mist.png
│   ├── drizzle.png
│   ├── humidity.png
│   └── wind.png
├── videos/             # Background videos
│   └── rainy.mp4       # Default video (others can be added)
└── README.md           # This file
```

## 🔧 Setup & Installation

### Prerequisites
- A modern web browser
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation Steps

1. **Clone or download** this repository
2. **Get API Key**:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Replace `YOUR_API_KEY` in `script.js` line 1:
     ```javascript
     const apiKey = "YOUR_API_KEY";
     ```

3. **Run the app**:
   - Open `index.html` directly in your browser, or
   - Use a local server (VS Code Live Server, Python `http.server`, etc.)

## 📱 How to Use

1. **Search by City**: Type a city name and press Enter or click the search button
2. **Use Current Location**: Click "Use my location" for instant weather at your position
3. **Switch Units**: Toggle between °C and °F using the unit buttons
4. **View Details**: See temperature, feels like, humidity, wind speed, pressure, visibility, and last updated time

## 🎨 Weather Themes

The app automatically changes its appearance based on weather conditions:

- **Clear/Sunny**: Blue sky gradients
- **Cloudy**: Gray/white cloud themes
- **Rainy**: Dark blue rain themes
- **Snowy**: Light blue/white winter themes
- **Misty/Foggy**: Purple/gray mist themes

## 🎥 Background Videos

Currently includes `rainy.mp4`. To enable full dynamic backgrounds, add these videos to the `videos/` folder:
- `cloudy.mp4`
- `sunny.mp4`
- `misty.mp4`
- `drizzle.mp4`
- `snow.mp4`

## 🔑 API Configuration

The app uses OpenWeatherMap's free tier:
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Rate Limit**: 60 calls/minute for free tier
- **Units**: Metric (°C) and Imperial (°F) supported

## 🌟 Key Features Explained

### Dynamic Theming
```javascript
// Theme changes based on weather and time
applyTheme(main, isDay);
```

### Unit Persistence
```javascript
// Units are saved to localStorage
localStorage.setItem("unit", unit);
```

### Geolocation Support
```javascript
// Uses browser's geolocation API
navigator.geolocation.getCurrentPosition(...)
```

## 🚧 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🤝 Contributing

Feel free to contribute by:
- Adding new weather themes
- Improving accessibility
- Adding more weather details
- Creating additional background videos
- Optimizing performance

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Google Fonts](https://fonts.google.com/) for typography
- Weather icons from the project's assets

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure you have an internet connection
4. Check if the city name is spelled correctly

---

**Enjoy checking the weather with style! 🌈**