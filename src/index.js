require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const WEATHER_API_KEY = '5c3bf9f42141f0957aa0d26a8c93bcc8';
const DISCORD_BOT_TOKEN = 'YMTI1ODUzODQ4ODkyODkzMTg4Mg.G-ZA4N.EyeRb2yFavO3xYl7hDGbIkUAbRV3H8jng-mitY';

client.once('ready', () => {
  console.log('Weather bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!weather')) {
    const args = message.content.split(' ');
    const city = args[1];

    if (!city) {
      return message.channel.send('Please provide a city name.');
    }

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
      const weatherData = response.data;
      const weatherInfo = `
        Weather in ${weatherData.name}, ${weatherData.sys.country}:
        Temperature: ${weatherData.main.temp}°C
        Weather: ${weatherData.weather[0].description}
        Humidity: ${weatherData.main.humidity}%
        Wind Speed: ${weatherData.wind.speed} m/s
      `;

      message.channel.send(weatherInfo);
    } catch (error) {
      console.error(error);
      message.channel.send('Unable to fetch weather data. Please make sure the city name is correct.');
    }
  }
});

client.login(process.env.TOKEN);