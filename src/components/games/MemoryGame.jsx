import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiRotateCcw, FiAward } = FiIcons;

// Use icons that are guaranteed to exist in FiIcons
const iconNames = [
  'Activity', 'Anchor', 'Award', 'Bell', 
  'Camera', 'Coffee', 'Heart', 'Star', 
  'Bookmark', 'Flag', 'Gift', 'Music'
];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [bestScore, setBestScore] = useState(null);

  // Initialize the game
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);

  // Check for game completion
  useEffect(() => {
    if (solved.length > 0 && solved.length === cards.length / 2) {
      const completionTime = Date.now() - startTime;
      setEndTime(completionTime);
      setGameOver(true);
      
      // Update best score
      const previousBest = localStorage.getItem('memoryGameBestScore');
      if (!previousBest || moves < parseInt(previousBest)) {
        localStorage.setItem('memoryGameBestScore', moves.toString());
        setBestScore(moves);
      }
    }
  }, [solved, cards, startTime, moves]);

  // Load best score on mount
  useEffect(() => {
    const savedBestScore = localStorage.getItem('memoryGameBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Initialize the game with shuffled cards
  const initializeGame = () => {
    // Create pairs of cards with icons
    const gameIcons = iconNames.map(name => {
      const iconComponent = FiIcons[`Fi${name}`];
      return iconComponent;
    }).filter(Boolean).slice(0, 6); // Use 6 icons for 12 cards
    
    const cardPairs = [...gameIcons, ...gameIcons].map((icon, index) => ({
      id: index,
      icon,
      flipped: false,
      solved: false,
    }));
    
    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(Date.now());
    setEndTime(null);
  };

  // Start a new game
  const startGame = () => {
    setGameStarted(true);
  };

  // Restart the game
  const restartGame = () => {
    initializeGame();
  };

  // Handle card click
  const handleClick = (id) => {
    // Ignore clicks if disabled or card is already flipped/solved
    if (disabled || flipped.includes(id) || solved.includes(cards[id].icon)) {
      return;
    }
    
    // Add card to flipped
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    // If this is the second card flipped
    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setDisabled(true);
      
      const [firstId, secondId] = newFlipped;
      if (cards[firstId].icon === cards[secondId].icon) {
        // Cards match
        setSolved([...solved, cards[firstId].icon]);
        setFlipped([]);
        setDisabled(false);
      } else {
        // Cards don't match, flip them back
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  // Format time from milliseconds to mm:ss
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Memory Game</h2>
      
      {!gameStarted ? (
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Test your memory by matching pairs of cards. Try to finish with as few moves as possible.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-6 py-3 bg-notion-600 hover:bg-notion-700 text-white rounded-lg font-medium"
          >
            Start Game
          </motion.button>
        </div>
      ) : (
        <>
          {/* Game stats */}
          <div className="flex justify-between w-full mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Moves</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{moves}</p>
            </div>
            {bestScore !== null && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Best</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{bestScore}</p>
              </div>
            )}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pairs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{solved.length}/{cards.length/2}</p>
            </div>
          </div>
          
          {/* Game board - Improved spacing */}
          <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xs mx-auto">
            {cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                icon={card.icon}
                flipped={flipped.includes(card.id)}
                solved={solved.includes(card.icon)}
                onClick={() => handleClick(card.id)}
              />
            ))}
          </div>
          
          {/* Game controls */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restartGame}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 mt-2"
          >
            <SafeIcon icon={FiRotateCcw} className="w-4 h-4" />
            <span>Restart</span>
          </motion.button>
          
          {/* Game over modal */}
          {gameOver && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiAward} className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                  Congratulations!
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
                  You completed the game in {moves} moves and {formatTime(endTime)}.
                </p>
                {bestScore === moves && (
                  <p className="text-green-600 dark:text-green-400 text-center font-medium mb-4">
                    That's a new best score!
                  </p>
                )}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={restartGame}
                    className="px-6 py-2 bg-notion-600 hover:bg-notion-700 text-white rounded-lg font-medium"
                  >
                    Play Again
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Card component
const Card = ({ id, icon, flipped, solved, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: flipped || solved ? 1 : 1.05 }}
      whileTap={{ scale: flipped || solved ? 1 : 0.95 }}
      className={`w-full h-24 cursor-pointer relative ${
        flipped || solved ? 'pointer-events-none' : ''
      }`}
      onClick={onClick}
    >
      <motion.div
        className={`absolute inset-0 rounded-lg ${
          solved ? 'bg-green-100 dark:bg-green-900/30' : 'bg-notion-100 dark:bg-notion-900/30'
        } flex items-center justify-center ${flipped || solved ? '' : 'hidden'}`}
        initial={false}
        animate={{ rotateY: flipped || solved ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <SafeIcon 
          icon={icon} 
          className={`w-10 h-10 ${solved ? 'text-green-600 dark:text-green-400' : 'text-notion-600 dark:text-notion-400'}`} 
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        initial={false}
        animate={{ rotateY: flipped || solved ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <span className="text-2xl text-gray-400 dark:text-gray-500">?</span>
      </motion.div>
    </motion.div>
  );
};

export default MemoryGame;