import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTodos } from '../contexts/TodoContext';

const { FiCheck, FiEdit2, FiTrash2, FiMoreHorizontal } = FiIcons;

const TodoItem = ({ todo, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const { toggleTodo, deleteTodo, editTodo, updatePriority } = useTodos();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      editTodo(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const priorityColors = {
    high: 'border-l-red-400 bg-red-50/50 dark:bg-red-900/10',
    medium: 'border-l-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10',
    low: 'border-l-green-400 bg-green-50/50 dark:bg-green-900/10',
  };

  const priorityDots = {
    high: 'bg-red-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative p-4 rounded-xl border-l-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 ${priorityColors[todo.priority]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${
            todo.completed
              ? 'bg-notion-600 border-notion-600 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-notion-500 dark:hover:border-notion-400'
          }`}
        >
          {todo.completed && <SafeIcon icon={FiCheck} className="w-3 h-3" />}
        </motion.button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 text-sm bg-transparent border-b border-notion-400 focus:outline-none text-gray-900 dark:text-white"
              autoFocus
            />
          ) : (
            <p
              className={`text-sm transition-all duration-200 ${
                todo.completed
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {todo.text}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${priorityDots[todo.priority]}`} />
          
          {/* Sliding delete button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 20
            }}
            transition={{ duration: 0.2 }}
            className="mr-2"
          >
            <button
              onClick={handleDelete}
              className="p-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-3.5 h-3.5" />
            </button>
          </motion.div>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
              >
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiEdit2} className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;