import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSettings } from '../contexts/SettingsContext';
import { useTodos } from '../contexts/TodoContext';
import { useTheme } from '../contexts/ThemeContext';
import WelcomeModal from '../components/WelcomeModal';

const { FiSettings, FiDownload, FiUpload, FiTrash2, FiHelpCircle, FiToggleLeft, FiToggleRight, FiSun, FiMoon, FiMonitor, FiClock, FiGamepad, FiZap } = FiIcons;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const SettingsPage = () => {
  const { settings, updateSetting } = useSettings();
  const { exportTodos, importTodos, clearAllTodos, todos } = useTodos();
  const { theme, setTheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = importTodos(e.target.result);
        setImportStatus(success ? 'success' : 'error');
        setTimeout(() => setImportStatus(''), 3000);
      };
      reader.readAsText(file);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      clearAllTodos();
    }
  };

  const themes = [
    { value: 'light', label: 'Light', icon: FiSun },
    { value: 'dark', label: 'Dark', icon: FiMoon },
    { value: 'system', label: 'System', icon: FiMonitor },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your Zen Tasks experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiSun} className="w-5 h-5" />
            <span>Appearance</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex space-x-3">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                      theme === t.value
                        ? 'bg-notion-100 dark:bg-notion-900/30 border-notion-300 dark:border-notion-700 text-notion-700 dark:text-notion-300'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <SafeIcon icon={t.icon} className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tool Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiClock} className="w-5 h-5" />
            <span>Tools</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Sound Effects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Play sounds when timers start and complete
                </p>
              </div>
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.soundEnabled ? FiToggleRight : FiToggleLeft}
                  className={`w-8 h-8 transition-colors ${
                    settings.soundEnabled ? 'text-notion-600 dark:text-notion-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Celebration Confetti</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show confetti when timers finish
                </p>
              </div>
              <button
                onClick={() => updateSetting('confettiOnComplete', !settings.confettiOnComplete)}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.confettiOnComplete ? FiToggleRight : FiToggleLeft}
                  className={`w-8 h-8 transition-colors ${
                    settings.confettiOnComplete ? 'text-notion-600 dark:text-notion-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </button>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Default Pomodoro Times</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Focus (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultPomodoroMinutes}
                    onChange={(e) => updateSetting('defaultPomodoroMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultShortBreakMinutes}
                    onChange={(e) => updateSetting('defaultShortBreakMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultLongBreakMinutes}
                    onChange={(e) => updateSetting('defaultLongBreakMinutes', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiGamepad} className="w-5 h-5" />
            <span>Games</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Enable Games</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show mini-games for mental breaks
                </p>
              </div>
              <button
                onClick={() => updateSetting('enableGames', !settings.enableGames)}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.enableGames ? FiToggleRight : FiToggleLeft}
                  className={`w-8 h-8 transition-colors ${
                    settings.enableGames ? 'text-notion-600 dark:text-notion-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiSettings} className="w-5 h-5" />
            <span>General</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Show welcome on startup</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Display the welcome guide every time you open the app
                </p>
              </div>
              <button
                onClick={() => updateSetting('showWelcomeOnStartup', !settings.showWelcomeOnStartup)}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.showWelcomeOnStartup ? FiToggleRight : FiToggleLeft}
                  className={`w-8 h-8 transition-colors ${
                    settings.showWelcomeOnStartup ? 'text-notion-600 dark:text-notion-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Auto-save</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically save your tasks as you type
                </p>
              </div>
              <button
                onClick={() => updateSetting('autoSave', !settings.autoSave)}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.autoSave ? FiToggleRight : FiToggleLeft}
                  className={`w-8 h-8 transition-colors ${
                    settings.autoSave ? 'text-notion-600 dark:text-notion-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Animations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable smooth animations and transitions
                </p>
              </div>
              <button
                onClick={() => updateSetting('animations', !settings.animations)}
                className="flex items-center"
              >
                <SafeIcon
                  icon={settings.animations ? FiToggleRight : FiToggleLeft}
                  className={`w-8 h-8 transition-colors ${
                    settings.animations ? 'text-notion-600 dark:text-notion-400' : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiDownload} className="w-5 h-5" />
            <span>Data Management</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Export Tasks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download your tasks as a JSON file ({todos.length} tasks)
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={exportTodos}
                disabled={todos.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-notion-600 hover:bg-notion-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Import Tasks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a JSON file to restore your tasks
                </p>
                {importStatus && (
                  <p
                    className={`text-sm mt-1 ${
                      importStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {importStatus === 'success' ? 'Tasks imported successfully!' : 'Failed to import tasks'}
                  </p>
                )}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiUpload} className="w-4 h-4" />
                  <span>Import</span>
                </motion.div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Clear All Tasks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently delete all your tasks
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearAll}
                disabled={todos.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                <span>Clear All</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiHelpCircle} className="w-5 h-5" />
            <span>Help</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">View Tutorial</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See the welcome guide with keyboard shortcuts
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowWelcome(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <SafeIcon icon={FiHelpCircle} className="w-4 h-4" />
                <span>Show Guide</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
    </motion.div>
  );
};

export default SettingsPage;