# Pokédex Lite

A modern, responsive Pokédex application built with Next.js 15, TypeScript, and Tailwind CSS. Explore the world of Pokémon with beautiful animations, search functionality, type filtering, and a favorites system.

![Pokédex Lite](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer)

## 🚀 Features

### Core Features
- **📱 Fully Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **🔍 Real-time Search** - Debounced search functionality for optimal performance
- **🎯 Type Filtering** - Multi-select filter by Pokémon types with AND logic
- **♾️ Infinite Scroll** - Seamless pagination with "Load More" fallback
- **❤️ Favorites System** - Save favorite Pokémon with localStorage persistence
- **📊 Detailed Views** - Beautiful modal with stats, abilities, and descriptions
- **🌙 Dark Mode** - Automatic system preference detection
- **♿ Accessibility** - Full ARIA support and keyboard navigation

### Technical Features
- **⚡ Performance Optimized** - Lazy loading, debouncing, and efficient rendering
- **🎨 Beautiful Animations** - Smooth Framer Motion animations throughout
- **🛡️ Error Handling** - Graceful error states with retry functionality
- **🔧 Type Safety** - Complete TypeScript implementation
- **📦 Modern Stack** - Next.js 15 App Router, React 19, Tailwind CSS 4

## 🛠️ Tech Stack

I chose this stack for optimal developer experience and production performance:

- **Next.js 15 (App Router)** - Latest React framework with excellent performance and SEO
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS 4** - Utility-first CSS framework for rapid styling
- **Framer Motion** - Smooth animations and micro-interactions
- **Lucide React** - Beautiful, consistent icon library
- **Axios** - Reliable HTTP client for API calls
- **PokéAPI** - Official Pokémon data source

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pokedex-lite.git
   cd pokedex-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### Browsing Pokémon
- Scroll down to automatically load more Pokémon (infinite scroll)
- Use the "Load More" button if auto-scroll doesn't work
- Click any Pokémon card to view detailed information

### Search
- Start typing in the search bar to find Pokémon by name
- Search is debounced (300ms) for optimal performance
- Results appear instantly as you type

### Type Filtering
- Click the "Filter by Type" button to open the filter dropdown
- Select multiple types to filter (AND logic applied)
- Click on selected type badges to remove individual filters
- Use "Clear All" to reset all type filters

### Favorites
- Click the heart icon on any Pokémon card to add/remove from favorites
- Toggle between "All" and "Favorites" to view your collection
- Favorites are saved in localStorage and persist across sessions

### Detailed Views
- Click any Pokémon card to open the detail modal
- View comprehensive information including:
  - High-quality artwork
  - Base stats with visual progress bars
  - Height and weight (formatted for readability)
  - Abilities (including hidden abilities)
  - Flavor text descriptions
- Press ESC or click outside to close the modal

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles and animations
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx          # Main application page
├── components/            # Reusable React components
│   ├── ErrorDisplay.tsx   # Error handling component
│   ├── PokemonCard.tsx    # Individual Pokémon card
│   ├── PokemonModal.tsx   # Detail view modal
│   ├── PokedexGrid.tsx    # Grid layout with infinite scroll
│   ├── SearchBar.tsx      # Search input with debouncing
│   ├── SkeletonCard.tsx   # Loading placeholder
│   └── TypeFilter.tsx     # Type filtering dropdown
├── hooks/                # Custom React hooks
│   └── use-pokemon.ts    # Pokémon data management
├── lib/                  # Utility libraries
│   └── pokemon-api.ts     # PokéAPI integration
├── types/                # TypeScript type definitions
│   └── pokemon.ts        # Pokémon data interfaces
└── utils/                # Helper functions
    └── helpers.ts        # Utility functions
```

## 🎨 Design Decisions

### Color Scheme
- **Primary**: Red and blue gradients (Pokémon brand colors)
- **Type Colors**: Accurate official Pokémon type colors
- **Dark Mode**: System preference detection with smooth transitions

### Animations
- **Micro-interactions**: Hover effects, button states, card animations
- **Page Transitions**: Smooth entry/exit animations
- **Loading States**: Skeleton loaders with shimmer effects
- **Modal Animations**: Scale and fade effects for better UX

### Performance
- **Lazy Loading**: Images and components load as needed
- **Debouncing**: Search queries are optimized
- **Memoization**: React hooks prevent unnecessary re-renders
- **Bundle Optimization**: Next.js automatic code splitting

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

The application includes comprehensive error handling and retry mechanisms. To test:

1. **Network Errors**: Disconnect internet to see error states
2. **Search Functionality**: Test various search queries and edge cases
3. **Type Filtering**: Try different type combinations
4. **Responsive Design**: Test on different screen sizes
5. **Accessibility**: Use keyboard navigation and screen readers

## 🐛 Troubleshooting

### Common Issues

**Q: Images not loading**
A: Check your internet connection and ensure PokéAPI is accessible

**Q: Search not working**
A: Clear browser cache and ensure JavaScript is enabled

**Q: Favorites not saving**
A: Check that localStorage is enabled in your browser

**Q: Performance issues**
A: The app uses infinite scroll to manage memory. Try refreshing the page

### Getting Help
- Open an issue on GitHub
- Check the browser console for error messages
- Ensure you're using a modern browser (Chrome 90+, Firefox 88+, Safari 14+)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PokéAPI** - For providing comprehensive Pokémon data
- **Pokémon Company** - For creating this amazing universe
- **Next.js Team** - For the excellent framework
- **Tailwind CSS Team** - For the utility-first CSS framework

## 📞 Contact

- Project Link: [https://github.com/your-username/pokedex-lite](https://github.com/your-username/pokedex-lite)
- Live Demo: [https://pokedex-lite.vercel.app](https://pokedex-lite.vercel.app)

---

**Built with ❤️ by a passionate frontend developer**
