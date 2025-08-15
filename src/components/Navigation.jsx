import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ThemeToggle from './ThemeToggle';
import WelcomeModal from './WelcomeModal';

const { FiCheckSquare, FiClock, FiInfo, FiSettings, FiHelpCircle, FiMail } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const navItems = [
    { path: '/', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/tools', icon: FiClock, label: 'Tools' },
    { path: '/about', icon: FiInfo, label: 'About' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 mr-4">
                <SafeIcon icon={FiCheckSquare} className="w-6 h-6 text-notion-600 dark:text-notion-400" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Zen Tasks</span>
              </Link>
              
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-2 ml-2"
                  >
                    <motion.button
                      onClick={() => setShowWelcome(true)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <SafeIcon icon={FiHelpCircle} className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                    
                    <motion.a
                      href="mailto:contact@yourportfolio.com"
                      className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-notion-600 dark:text-notion-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={item.icon} className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-notion-100 dark:bg-notion-900/30 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
      
      <AnimatePresence>
        {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navigation;