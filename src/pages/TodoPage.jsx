import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTodos } from '../contexts/TodoContext';
import { useSettings } from '../contexts/SettingsContext';
import AddTodo from '../components/AddTodo';
import TodoItem from '../components/TodoItem';
import MemoryGame from '../components/games/MemoryGame';

const { FiFilter, FiCheckCircle, FiCircle, FiStar, FiGamepad, FiX } = FiIcons;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const TodoPage = () => {
  const { todos } = useTodos();
  const { settings } = useSettings();
  const [filter, setFilter] = useState('all');
  const [showGame, setShowGame] = useState(false);
  const [showGameBubble, setShowGameBubble] = useState(true);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'high':
        return todo.priority === 'high' && !todo.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    high: todos.filter(t => t.priority === 'high' && !t.completed).length,
  };

  const filters = [
    { key: 'all', label: 'All', icon: FiCircle, count: stats.total },
    { key: 'active', label: 'Active', icon: FiCircle, count: stats.active },
    { key: 'completed', label: 'Completed', icon: FiCheckCircle, count: stats.completed },
    { key: 'high', label: 'High Priority', icon: FiStar, count: stats.high },
  ];

  const handleToggleGame = () => {
    setShowGame(!showGame);
    setShowGameBubble(false);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find your zen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay organized and productive with your personal task manager
          </p>
        </div>
        {settings.enableGames && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleGame}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                showGame
                  ? 'bg-notion-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <SafeIcon icon={FiGamepad} className="w-4 h-4" />
              <span className="hidden sm:inline">{showGame ? 'Hide Game' : 'Take a Break'}</span>
            </motion.button>

            {showGameBubble && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-48"
              >
                <button
                  onClick={() => setShowGameBubble(false)}
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <SafeIcon icon={FiX} className="w-3 h-3" />
                </button>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Need a mental break? Play a quick game to refresh your mind!
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <AddTodo />

        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filterOption) => (
              <motion.button
                key={filterOption.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(filterOption.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === filterOption.key
                    ? 'bg-notion-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <SafeIcon icon={filterOption.icon} className="w-4 h-4" />
                <span>{filterOption.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === filterOption.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {filterOption.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`space-y-3 ${showGame ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <AnimatePresence mode="popLayout">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo, index) => (
                  <TodoItem key={todo.id} todo={todo} index={index} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <SafeIcon icon={FiCheckCircle} className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'completed'
                      ? 'No completed tasks yet'
                      : filter === 'active'
                      ? 'No active tasks'
                      : filter === 'high'
                      ? 'No high priority tasks'
                      : 'No tasks yet'}
                  </p>
                  {filter === 'all' && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Press Ctrl/Cmd + Enter to add your first task
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {showGame && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:col-span-1"
            >
              <MemoryGame />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TodoPage;