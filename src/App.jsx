import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import TodoPage from './pages/TodoPage';
import ToolsPage from './pages/ToolsPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import WelcomeModal from './components/WelcomeModal';
import QuickAdd from './components/QuickAdd';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { ThemeProvider } from './contexts/ThemeContext';
import { TodoProvider } from './contexts/TodoContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './index.css';

// Animated routes wrapper component
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<TodoPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false);
  const [installPromptInterval, setInstallPromptInterval] = useState(null);

  useKeyboardShortcuts({ setShowQuickAdd });

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    const showOnStartup = localStorage.getItem('showWelcomeOnStartup') !== 'false';
    
    if (!hasSeenWelcome || showOnStartup) {
      setShowWelcome(true);
    }

    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const lastPrompted = localStorage.getItem('lastPwaPrompt');
    const now = Date.now();
    
    // Show prompt if not installed and either never prompted or prompted more than 3 days ago
    if (!isAppInstalled && (!lastPrompted || (now - parseInt(lastPrompted)) > 3 * 24 * 60 * 60 * 1000)) {
      // Delay the install prompt to not overwhelm users
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
        localStorage.setItem('lastPwaPrompt', now.toString());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // Set up periodic prompting if not installed and not currently showing
    if (!isAppInstalled && !installPromptDismissed && !showInstallPrompt) {
      const interval = setInterval(() => {
        setShowInstallPrompt(true);
        localStorage.setItem('lastPwaPrompt', Date.now().toString());
      }, 30 * 60 * 1000); // 30 minutes
      
      setInstallPromptInterval(interval);
      return () => clearInterval(interval);
    }
  }, [installPromptDismissed, showInstallPrompt]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleInstallPromptClose = () => {
    setShowInstallPrompt(false);
    setInstallPromptDismissed(true);
    
    // Clear any existing interval
    if (installPromptInterval) {
      clearInterval(installPromptInterval);
      setInstallPromptInterval(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Router>
        <Navigation />
        <main className="pt-16 overflow-x-hidden">
          <AnimatedRoutes />
        </main>
        
        <AnimatePresence>
          {showWelcome && (
            <WelcomeModal onClose={handleWelcomeClose} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showQuickAdd && (
            <QuickAdd onClose={() => setShowQuickAdd(false)} />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showInstallPrompt && (
            <PWAInstallPrompt onClose={handleInstallPromptClose} />
          )}
        </AnimatePresence>
      </Router>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <TodoProvider>
          <AppContent />
        </TodoProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;