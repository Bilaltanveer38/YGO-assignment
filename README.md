# Weather Dashboard - YGO Frontend Challenge

A modern, responsive weather dashboard built with SvelteKit and TailwindCSS that demonstrates an AI-first development approach.

## 🎯 Features Implemented

✅ **AI-First Development** - Heavy use of Claude Code for development, code generation, and problem-solving
✅ **Responsive UI** - Pixel-perfect implementation of the provided TailwindCSS mockup
✅ **Real-time Weather Data** - Integration with OpenWeatherMap API for live weather information
✅ **City Search with Autocomplete** - Smart city search with debounced input and dropdown suggestions
✅ **Dark/Light Theme Toggle** - Seamless theme switching with localStorage persistence
✅ **Loading States & Error Handling** - User-friendly loading spinners and error messages
✅ **Smooth Animations** - CSS transitions and animations for enhanced UX
✅ **Unit Tests** - Comprehensive test coverage for API endpoints

## 🚀 Extra Points Features

- ✅ **Loading States** - Spinner animations while fetching data
- ✅ **Error Handling** - User-friendly error messages for API failures
- ✅ **Animations** - Smooth transitions and fade-in effects
- ✅ **Dark Mode Support** - Toggle between light and dark themes
- ✅ **Debounced Search** - 300ms debounce to avoid excessive API calls
- ✅ **Unit Tests** - Test coverage for weather API functions

## 🛠 Technology Stack

- **SvelteKit** - Full-stack web application framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **OpenWeatherMap API** - Real weather data provider
- **Vitest** - Testing framework
- **Vite** - Build tool and development server

## 📁 Project Structure

```
├── src/
│   ├── routes/
│   │   ├── +layout.svelte         # Main layout with theme toggle
│   │   ├── +page.svelte           # Weather dashboard page
│   │   └── api/
│   │       ├── weather/+server.ts # Weather API endpoint
│   │       └── cities/+server.ts  # Cities autocomplete endpoint
│   ├── lib/
│   │   └── __tests__/            # Unit tests
│   └── app.css                   # Global styles
├── ai-conversations/             # AI development documentation
└── tailwind.config.js           # TailwindCSS configuration
```

## 🔧 Setup & Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with your OpenWeatherMap API key:
   ```
   OPEN_WEATHER_MAP_API=your_api_key_here
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## 🌐 API Endpoints

- **GET /api/weather?city={cityName}** - Get weather data for a city
- **GET /api/cities?q={query}** - Get city suggestions for autocomplete

## 🤖 AI-First Development Approach

This project was built using an AI-first methodology with Claude Code, demonstrating:

- **Code Generation** - AI assistance for component creation and API implementation
- **Problem Solving** - AI help with debugging and optimization
- **Best Practices** - AI guidance on code structure and patterns
- **Testing** - AI assistance with test creation and validation

All AI conversations and development process documentation can be found in the `/ai-conversations/` folder.

## 🎨 UI/UX Features

- **Responsive Design** - Works perfectly on desktop and mobile
- **Accessibility** - Proper ARIA labels and keyboard navigation
- **Performance** - Optimized API calls and smooth animations
- **User Experience** - Intuitive interface with helpful feedback

## 📱 Deployment

The application is ready for deployment on Vercel or any other SvelteKit-compatible platform.

---

Built with ❤️ using AI-first development principles for the YGO Frontend Challenge.
