# Seterra Pakistan

A geography quiz game for learning Pakistani and Punjabi cities, inspired by [Seterra](https://www.geoguessr.com/quiz/seterra).

## Features

- **Interactive Map Quiz**: Click on cities to identify them on an interactive map
- **Multiple Quiz Modes**:
  - All Pakistan (90+ cities)
  - Punjab Province (30 cities)
  - Sindh Province (15 cities)
  - Khyber Pakhtunkhwa (15 cities)
  - Balochistan Province (12 cities)
- **Seterra-style Feedback**:
  - White marker: Correct on first try
  - Yellow marker: Correct on second try
  - Red marker: Incorrect (shown after 2 attempts)
- **Score Tracking**: Percentage-based scoring with timer
- **Progress Bar**: Visual progress through the quiz
- **Dark Theme**: Modern, clean UI inspired by Seterra

## How to Play

1. Select a quiz mode (All Pakistan, Punjab, etc.)
2. Click "Start Quiz"
3. Find the city shown on the map and click its marker
4. Get 2 attempts per city
5. Complete all cities to see your final score

## Tech Stack

- HTML5 / CSS3 / JavaScript (Vanilla)
- [Leaflet.js](https://leafletjs.com/) for interactive maps
- [CARTO Dark Basemap](https://carto.com/basemaps/) for map tiles

## Running Locally

Simply open `index.html` in a modern web browser. No build step required.

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js http-server
npx http-server
```

Then visit `http://localhost:8000`

## City Data

The game includes coordinates for 90+ Pakistani cities organized by province:
- Punjab (30 cities including Lahore, Faisalabad, Rawalpindi, Multan, etc.)
- Sindh (15 cities including Karachi, Hyderabad, Sukkur, etc.)
- KPK (15 cities including Peshawar, Mardan, Abbottabad, etc.)
- Balochistan (12 cities including Quetta, Gwadar, Turbat, etc.)
- Federal Capital (Islamabad)
- Azad Kashmir (5 cities)
- Gilgit-Baltistan (5 cities)

## License

MIT
