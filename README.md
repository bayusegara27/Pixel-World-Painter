# Pixel World Painter

![Pixel World Painter Screenshot](https://storage.googleapis.com/generative-ai-pro-isv-shared-chat-uploads/2024-05-24/c48873f5-7c73-45a8-9844-486188e604f8.png)

## Welcome to Pixel World Painter! 🎨🌍

Ever wanted to leave your mark on the entire world? Now you can!

Pixel World Painter is a massive, collaborative art experiment built on an interactive world map. It's a persistent digital canvas where you can team up with others to create sprawling works of art, defend your territory, or just have fun placing pixels one by one. Inspired by legendary projects like `r/place`, this is your chance to paint the globe.

### 🚧 Project Status: In Development 🚧

Heads up! This project is a work-in-progress. Right now, it's a **client-side only experience**. All of your beautiful pixel art is saved directly in your browser's `localStorage`. This means it's persistent for you, but it's not yet a real-time, shared canvas with other users.

Think of it as the foundational single-player mode. The next giant leap is to build the real-time backend!

## ✨ Features

- **Massive World Canvas**: The entire world is your canvas, rendered on an interactive Leaflet map.
- **Pixel-Perfect Grid**: Zoom in to reveal the pixel grid and start painting.
- **Intuitive Tools**: Seamlessly switch between Paint, Eraser, and Color Picker tools.
- **Smart Color Palette**: Includes a default palette and a history of your recently used colors.
- **Slick UI**: A modern, responsive, and dark-themed interface that's a joy to use.
- **Keyboard Shortcuts**: Power-user shortcuts for tools, grid, and info panels.
- **Shareable Locations**: Copy a link to any pixel to share your findings or creations.
- **Browser Persistence**: Your artwork is automatically saved in your browser's local storage.

## 🚀 Future Goals

The journey is just beginning! Here's what's on the horizon:

- **Real-time Collaborative Backend**: The top priority! We'll be building a backend (likely with Node.js, WebSockets, and Redis) to turn this into a true multiplayer experience.
- **User Authentication**: So you can claim your creations.
- **Advanced Tools**: Features like line or fill tools.
- **Performance Optimizations**: Ensuring the canvas stays smooth even with millions of pixels.

## 🛠️ Built With

- **Framework**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) - For a blazing fast development experience.
- **Package Manager**: [Bun](https://bun.sh/)
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## ⚡️ Running Locally

Ready to jump in and start coding? Let's get you set up in just two steps.

1.  **Install Dependencies:**
    (We recommend using [Bun](https://bun.sh/) for speed, but `npm` or `yarn` will also work.)
    ```bash
    bun install
    ```

2.  **Start the Development Server:**
    ```bash
    bun dev
    ```
    And that's it! The project will be running on `http://localhost:5173`.

## 📂 A Quick Code Tour

We've worked hard to keep the codebase clean, modular, and easy to understand. Here's a map to help you find your way around:

```
/
├── components/     # All the reusable React bits and pieces (Palette, Toolbar, etc.)
│   └── map/        # Components and logic specific to the Leaflet map.
├── hooks/          # Our custom React hooks that handle the app's brainpower.
├── lib/            # Helper functions that are pure and reusable.
└── index.tsx       # The main entrypoint and global definitions.
```

## 🤝 We Love Contributions!

This is an open-source project, and we welcome contributions of all kinds! Whether you're fixing a bug, adding a new feature, or just improving the documentation, your help is greatly appreciated.

1.  **Fork the Project**
2.  Create your Feature Branch (`git checkout -b feature/MyCoolFeature`)
3.  Commit your Changes (`git commit -m 'Add some cool feature'`)
4.  Push to the Branch (`git push origin feature/MyCoolFeature`)
5.  Open a Pull Request

Don't forget to give the project a star if you like it! Thank you!

## 📄 License

Distributed under the MIT License.
