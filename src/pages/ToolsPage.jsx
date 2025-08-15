import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSettings } from '../contexts/SettingsContext';
import TetrisGame from '../components/games/TetrisGame';
import confetti from 'canvas-confetti';

const { FiPlay, FiPause, FiSquare, FiRotateCcw, FiClock, FiTimer, FiStopCircle, FiGamepad, FiCheck } = FiIcons;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('pomodoro');
  const { settings } = useSettings();

  const tabs = [
    { key: 'pomodoro', label: 'Pomodoro', icon: FiClock },
    { key: 'stopwatch', label: 'Stopwatch', icon: FiStopCircle },
    { key: 'timer', label: 'Timer', icon: FiTimer },
  ];

  if (settings.enableGames) {
    tabs.push({ key: 'game', label: 'Game', icon: FiGamepad });
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Productivity Tools
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Time management tools to boost your productivity
        </p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'text-notion-600 dark:text-notion-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <SafeIcon icon={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="activeToolTab"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm -z-10"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        {activeTab === 'pomodoro' && <PomodoroTimer />}
        {activeTab === 'stopwatch' && <Stopwatch />}
        {activeTab === 'timer' && <CountdownTimer />}
        {activeTab === 'game' && <TetrisGame />}
      </div>
    </motion.div>
  );
};

// Sound effects
const playSound = (type) => {
  const audio = new Audio();
  switch (type) {
    case 'complete':
      audio.src = 'https://soundbible.com/grab.php?id=2206&type=mp3'; // Success sound
      break;
    case 'tick':
      audio.src = 'https://soundbible.com/grab.php?id=2044&type=mp3'; // Tick sound
      break;
    case 'start':
      audio.src = 'https://soundbible.com/grab.php?id=1598&type=mp3'; // Start sound
      break;
    default:
      return;
  }
  audio.volume = 0.5;
  audio.play().catch(e => console.log("Audio play prevented: ", e));
};

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [customTime, setCustomTime] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);
  const { settings } = useSettings();

  const presetTimes = [
    { label: '5 min', minutes: 5 },
    { label: '15 min', minutes: 15 },
    { label: '25 min', minutes: 25 },
    { label: '45 min', minutes: 45 },
    { label: '60 min', minutes: 60 },
  ];

  useEffect(() => {
    setMinutes(settings.defaultPomodoroMinutes);
  }, [settings.defaultPomodoroMinutes]);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      setCompleted(true);

      // Play completion sound
      if (settings.soundEnabled !== false) {
        playSound('complete');
      }
      
      if (settings.confettiOnComplete) {
        triggerConfetti();
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, time, settings]);

  const formatTime = (seconds) => {
    if (seconds === 0 && completed) return "00:00";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (customTime) {
      const totalSeconds = (hours * 3600) + (minutes * 60) + parseInt(seconds || 0);
      if (totalSeconds > 0) {
        setTime(totalSeconds);
        setCustomTime(false);
      }
    }
    setCompleted(false);
    setIsActive(true);

    if (settings.soundEnabled !== false) {
      playSound('start');
    }
  };

  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    setCompleted(false);
    if (isBreak) {
      setTime(settings.defaultShortBreakMinutes * 60);
    } else {
      setTime(settings.defaultPomodoroMinutes * 60);
    }
  };

  const setCustomTimer = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + parseInt(seconds || 0);
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setCompleted(false);
      setCustomTime(false);
    }
  };

  const selectPresetTime = (minutes) => {
    setTime(minutes * 60);
    setCompleted(false);
    setIsActive(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleStartBreak = () => {
    if (isBreak) {
      // Switch to focus mode
      setTime(settings.defaultPomodoroMinutes * 60);
      setIsBreak(false);
    } else {
      // Switch to break mode
      setTime(settings.defaultShortBreakMinutes * 60);
      setIsBreak(true);
    }
    setCompleted(false);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {isBreak ? 'Break Time' : 'Focus Time'}
      </h2>

      {/* Quick preset buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {presetTimes.map((preset) => (
          <button
            key={preset.minutes}
            onClick={() => selectPresetTime(preset.minutes)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              time === preset.minutes * 60 && !isActive
                ? 'bg-notion-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setCustomTime(true)}
          className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Custom
        </button>
      </div>

      {completed ? (
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-green-600 dark:text-green-400 mb-4">
            Completed!
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isBreak ? "Break finished! Ready to focus again?" : "Great work! Time for a break?"}
          </p>
          <button
            onClick={handleStartBreak}
            className="px-6 py-2 bg-notion-600 hover:bg-notion-700 text-white rounded-lg font-medium transition-colors"
          >
            {isBreak ? "Start Focus Session" : "Start Break"}
          </button>
        </div>
      ) : (
        <div className="text-6xl font-mono font-bold text-notion-600 dark:text-notion-400 mb-8">
          {formatTime(time)}
        </div>
      )}

      {customTime && (
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                max="23"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                max="59"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Seconds</label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                max="59"
              />
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <button
              onClick={handleStart}
              className="px-4 py-2 bg-notion-600 hover:bg-notion-700 text-white rounded-lg text-sm transition-colors"
            >
              Start
            </button>
            <button
              onClick={() => setCustomTime(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!completed && !customTime && (
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isActive ? handlePause : handleStart}
            className="flex items-center space-x-2 px-6 py-3 bg-notion-600 hover:bg-notion-700 text-white rounded-lg font-medium transition-colors"
          >
            <SafeIcon icon={isActive ? FiPause : FiPlay} className="w-5 h-5" />
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
            <span>Reset</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(time => time + 1);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const formatTime = (centiseconds) => {
    const minutes = Math.floor(centiseconds / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const cs = centiseconds % 100;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    if (settings.soundEnabled !== false) {
      playSound('start');
    }
  };

  const handleStop = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Stopwatch</h2>
      
      <div className="text-6xl font-mono font-bold text-notion-600 dark:text-notion-400 mb-8">
        {formatTime(time)}
      </div>
      
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isActive ? handleStop : handleStart}
          className="flex items-center space-x-2 px-6 py-3 bg-notion-600 hover:bg-notion-700 text-white rounded-lg font-medium transition-colors"
        >
          <SafeIcon icon={isActive ? FiSquare : FiPlay} className="w-5 h-5" />
          <span>{isActive ? 'Stop' : 'Start'}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
          <span>Reset</span>
        </motion.button>
      </div>
    </div>
  );
};

const CountdownTimer = () => {
  const [time, setTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      setCompleted(true);
      
      if (settings.soundEnabled !== false) {
        playSound('complete');
      }
      
      if (settings.confettiOnComplete) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, time, settings]);

  const formatTime = (seconds) => {
    if (seconds === 0 && completed) return "00:00";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (time === 0) {
      const totalSeconds = (hours * 3600) + (minutes * 60) + parseInt(seconds || 0);
      if (totalSeconds > 0) {
        setTime(totalSeconds);
        setIsActive(true);
        setCompleted(false);
        
        if (settings.soundEnabled !== false) {
          playSound('start');
        }
      }
    } else {
      setIsActive(true);
      setCompleted(false);
    }
  };

  const handlePause = () => setIsActive(false);

  const handleReset = () => {
    setIsActive(false);
    setCompleted(false);
    setTime(0);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Countdown Timer</h2>
      
      {time === 0 && !isActive && !completed && (
        <div className="mb-6">
          <div className="flex justify-center space-x-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hours
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                max="23"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minutes
              </label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-20 px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                max="59"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Seconds
              </label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-20 px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                max="59"
              />
            </div>
          </div>
        </div>
      )}

      {completed ? (
        <div className="text-center mb-8">
          <div className="text-6xl font-mono font-bold text-green-600 dark:text-green-400 mb-4">
            Completed!
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center space-x-2 px-6 py-3 bg-notion-600 hover:bg-notion-700 text-white rounded-lg font-medium mx-auto"
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5" />
            <span>Done</span>
          </motion.button>
        </div>
      ) : (
        <div className="text-6xl font-mono font-bold text-notion-600 dark:text-notion-400 mb-8">
          {formatTime(time)}
        </div>
      )}

      {!completed && (
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isActive ? handlePause : handleStart}
            disabled={time === 0 && (hours === 0 && minutes === 0 && seconds === 0)}
            className="flex items-center space-x-2 px-6 py-3 bg-notion-600 hover:bg-notion-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <SafeIcon icon={isActive ? FiPause : FiPlay} className="w-5 h-5" />
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
            <span>Reset</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ToolsPage;