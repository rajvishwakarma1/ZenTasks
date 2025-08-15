import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiCheckSquare, FiKeyboard, FiZap, FiClock, FiSmile, FiGamepad } = FiIcons;

const WelcomeModal = ({ onClose }) => {
  const shortcuts = [
    { key: 'Ctrl/Cmd + Enter', action: 'Quick add task' },
    { key: 'Enter', action: 'Add new task' },
    { key: 'Escape', action: 'Cancel/Close' },
    { key: 'Space', action: 'Toggle task completion' },
    { key: 'Delete/Backspace', action: 'Delete task' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCheckSquare} className="w-8 h-8 text-notion-600 dark:text-notion-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Zen Tasks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiZap} className="w-5 h-5 text-notion-600 dark:text-notion-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Quick Start</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Stay focused and productive with minimal distractions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiClock} className="w-5 h-5 text-notion-600 dark:text-notion-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Productivity Tools</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Pomodoro timer, stopwatch and countdown tools with sound notifications.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiGamepad} className="w-5 h-5 text-notion-600 dark:text-notion-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Built-in Games</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Memory for focus training and Tetris for mental breaks.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiKeyboard} className="w-5 h-5 text-notion-600 dark:text-notion-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiSmile} className="w-5 h-5 text-notion-600 dark:text-notion-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Take Mindful Breaks</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Don't forget to rest! Click "Take a Break" to play a quick game.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-2 bg-notion-600 hover:bg-notion-700 text-white rounded-lg font-medium transition-colors"
          >
            Get Started
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeModal;