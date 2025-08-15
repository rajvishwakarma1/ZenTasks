# Zen Tasks

![Zen Tasks Logo](public/icons/favicon.svg)

A minimalist, powerful todo application designed to help you focus on what truly matters. Built with React, Tailwind CSS, and Framer Motion.

## Features

- **Task Management**: Create, edit, and organize tasks with priority levels
- **Productivity Tools**: Pomodoro timer, stopwatch, and countdown timer
- **Mindful Break Games**: Memory and Tetris games for mental refreshment
- **Dark/Light Mode**: Adaptive theme that respects system preferences
- **Keyboard Shortcuts**: Power-user friendly keyboard navigation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Progressive Web App**: Install on your device for offline access
- **Data Export/Import**: Backup and restore your tasks

## Screenshots

![Zen Tasks Dark Mode](https://placehold.co/600x400/1f2937/e5e7eb?text=Zen+Tasks+Dark+Mode)
![Zen Tasks Light Mode](https://placehold.co/600x400/f9fafb/111827?text=Zen+Tasks+Light+Mode)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- npm or yarn

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/zen-tasks.git
cd zen-tasks
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:5173/
```

## VS Code Setup

For the best development experience in VS Code:

1. Install recommended extensions:
   - ESLint
   - Tailwind CSS IntelliSense
   - Prettier

2. Add the following to your VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## Deployment

### GitHub Pages

1. Install gh-pages package:

```bash
npm install --save-dev gh-pages
```

2. Add the following to your `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/zen-tasks",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:

```bash
npm run deploy
```

### Netlify

1. Create a `netlify.toml` file:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy via the Netlify UI or CLI.

### Vercel

Simply connect your GitHub repository to Vercel and it will automatically detect your Vite project settings.

## Project Structure

```
zen-tasks/
├── public/              # Static assets
│   ├── icons/           # App icons
│   └── manifest.json    # PWA manifest
├── src/
│   ├── components/      # React components
│   │   ├── games/       # Game components
│   │   └── ...
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   └── common/          # Shared utilities
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
└── vite.config.js       # Vite configuration
```

## Technologies

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vite](https://vitejs.dev/)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/zen-tasks](https://github.com/yourusername/zen-tasks)