import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX, FiDownload, FiSmartphone } = FiIcons;

const PWAInstallPrompt = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-4 right-4 z-40"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 max-w-sm"
      >
        <div className="flex justify-between items-start">
          <div className="flex space-x-3">
            <div className="bg-notion-100 dark:bg-notion-900/30 rounded-lg p-2">
              <SafeIcon icon={FiSmartphone} className="w-5 h-5 text-notion-600 dark:text-notion-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Install Zen Tasks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Install this app on your device for quick access and offline use.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            Maybe later
          </button>
          <button
            className="px-3 py-1.5 bg-notion-600 hover:bg-notion-700 text-white text-sm font-medium rounded-lg flex items-center space-x-1"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Install</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PWAInstallPrompt;