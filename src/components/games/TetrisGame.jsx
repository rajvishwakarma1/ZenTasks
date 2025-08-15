import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlay, FiPause, FiRotateCcw } = FiIcons;

// Tetromino shapes
const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 'bg-cyan-500',
  },
  J: {
    shape: [
      [0, 0, 0],
      [2, 2, 2],
      [0, 0, 2],
    ],
    color: 'bg-blue-500',
  },
  L: {
    shape: [
      [0, 0, 0],
      [3, 3, 3],
      [3, 0, 0],
    ],
    color: 'bg-orange-500',
  },
  O: {
    shape: [
      [4, 4],
      [4, 4],
    ],
    color: 'bg-yellow-500',
  },
  S: {
    shape: [
      [0, 0, 0],
      [0, 5, 5],
      [5, 5, 0],
    ],
    color: 'bg-green-500',
  },
  T: {
    shape: [
      [0, 0, 0],
      [6, 6, 6],
      [0, 6, 0],
    ],
    color: 'bg-purple-500',
  },
  Z: {
    shape: [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7],
    ],
    color: 'bg-red-500',
  },
};

const TetrisGame = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dropTime, setDropTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Constants
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  
  // Create empty game board
  const createEmptyBoard = useCallback(() => {
    return Array.from(Array(BOARD_HEIGHT), () => 
      Array(BOARD_WIDTH).fill(0)
    );
  }, [BOARD_HEIGHT, BOARD_WIDTH]);
  
  // Get a random tetromino
  const getRandomTetromino = useCallback(() => {
    const keys = Object.keys(TETROMINOS);
    const randTetromino = keys[Math.floor(Math.random() * keys.length)];
    return TETROMINOS[randTetromino];
  }, []);
  
  // Initialize the board
  useEffect(() => {
    setBoard(createEmptyBoard());
  }, [createEmptyBoard]);
  
  // Start the game
  const startGame = useCallback(() => {
    // Reset everything
    setBoard(createEmptyBoard());
    setGameOver(false);
    setScore(0);
    setLevel(1);
    
    // Create new tetromino
    const newPiece = getRandomTetromino();
    const nextPiece = getRandomTetromino();
    
    setCurrentPiece(newPiece);
    setNextPiece(nextPiece);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 });
    setDropTime(1000);
    setPlaying(true);
    setGameStarted(true);
  }, [getRandomTetromino, createEmptyBoard, BOARD_WIDTH]);
  
  // Pause/resume game
  const togglePlay = () => {
    if (!gameStarted) {
      startGame();
      return;
    }
    
    if (playing) {
      setDropTime(null);
    } else {
      setDropTime(1000 / level);
    }
    setPlaying(!playing);
  };
  
  // Move tetromino horizontally
  const moveTetromino = useCallback((dir) => {
    if (!checkCollision(currentPiece?.shape, position.x + dir, position.y)) {
      setPosition(prev => ({ ...prev, x: prev.x + dir }));
    }
  }, [currentPiece, position]);
  
  // Rotate tetromino
  const rotateTetromino = useCallback(() => {
    if (!currentPiece) return;
    
    const rotatedPiece = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index])
      ).reverse()
    };
    
    if (!checkCollision(rotatedPiece.shape, position.x, position.y)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, position]);
  
  // Check for collision
  const checkCollision = useCallback((shape, x, y) => {
    if (!shape) return true;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        // Check if cell is non-empty
        if (shape[row][col] !== 0) {
          // Check if outside board boundaries
          if (
            y + row < 0 ||
            y + row >= BOARD_HEIGHT ||
            x + col < 0 ||
            x + col >= BOARD_WIDTH ||
            // Check if cell is already occupied
            (board[y + row] && board[y + row][x + col] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board, BOARD_HEIGHT, BOARD_WIDTH]);
  
  // Drop tetromino one row down
  const dropTetromino = useCallback(() => {
    if (!currentPiece) return;
    
    if (!checkCollision(currentPiece.shape, position.x, position.y + 1)) {
      setPosition(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      // Tetromino landed
      updateBoard();
    }
  }, [currentPiece, position, checkCollision]);
  
  // Update board when tetromino lands
  const updateBoard = useCallback(() => {
    if (currentPiece) {
      // Copy the board
      const newBoard = [...board];
      
      // Add tetromino to the board
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = y + position.y;
            const boardX = x + position.x;
            
            if (boardY < 0) {
              // Game over if piece lands above the board
              setGameOver(true);
              setPlaying(false);
              setDropTime(null);
              return;
            }
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = cell;
            }
          }
        });
      });
      
      // Check for completed rows
      let linesCleared = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y] && newBoard[y].every(cell => cell !== 0)) {
          // Remove completed row
          newBoard.splice(y, 1);
          // Add empty row at top
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          // Check same row again (since we moved rows down)
          y++;
        }
      }
      
      // Update score
      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] * level;
        setScore(prev => prev + points);
        
        // Level up every 10 lines
        const newTotalLines = Math.floor(score / 1000) + linesCleared;
        const newLevel = Math.floor(newTotalLines / 10) + 1;
        
        if (newLevel > level) {
          setLevel(newLevel);
          setDropTime(1000 / newLevel);
        }
      }
      
      // Update board
      setBoard(newBoard);
      
      // Get next tetromino
      setCurrentPiece(nextPiece);
      setNextPiece(getRandomTetromino());
      setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 });
    }
  }, [board, currentPiece, nextPiece, position, score, level, getRandomTetromino, BOARD_HEIGHT, BOARD_WIDTH]);
  
  // Key handler reference to avoid dependency issues
  const keyHandlerRef = useRef({
    moveTetromino,
    dropTetromino,
    rotateTetromino
  });

  useEffect(() => {
    keyHandlerRef.current = {
      moveTetromino,
      dropTetromino,
      rotateTetromino
    };
  }, [moveTetromino, dropTetromino, rotateTetromino]);

  // Handle keydown events
  useEffect(() => {
    if (!playing || gameOver) return;
    
    const handleKeyDown = (e) => {
      if (e.keyCode === 37) { // Left arrow
        keyHandlerRef.current.moveTetromino(-1);
      } else if (e.keyCode === 39) { // Right arrow
        keyHandlerRef.current.moveTetromino(1);
      } else if (e.keyCode === 40) { // Down arrow
        keyHandlerRef.current.dropTetromino();
      } else if (e.keyCode === 38) { // Up arrow
        keyHandlerRef.current.rotateTetromino();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [playing, gameOver]);
  
  // Drop tetromino at regular intervals
  useEffect(() => {
    let timer = null;
    
    if (dropTime && playing) {
      timer = setInterval(() => {
        dropTetromino();
      }, dropTime);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [dropTime, playing, dropTetromino]);
  
  // Render the game board
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current tetromino to display board
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = y + position.y;
            const boardX = x + position.x;
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = cell;
            }
          }
        });
      });
    }
    
    return (
      <div className="grid grid-cols-10 gap-0.5 border-2 border-gray-400 dark:border-gray-600 p-0.5 bg-gray-200 dark:bg-gray-700">
        {displayBoard.flat().map((cell, index) => (
          <div
            key={index}
            className={`w-5 h-5 ${
              cell === 0
                ? 'bg-gray-100 dark:bg-gray-800'
                : getCellColor(cell)
            }`}
          />
        ))}
      </div>
    );
  };
  
  // Get cell color based on tetromino type
  const getCellColor = (cell) => {
    const colors = {
      1: 'bg-cyan-500',
      2: 'bg-blue-500',
      3: 'bg-orange-500',
      4: 'bg-yellow-500',
      5: 'bg-green-500',
      6: 'bg-purple-500',
      7: 'bg-red-500',
    };
    return colors[cell] || 'bg-gray-400';
  };
  
  // Render next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    const shape = nextPiece.shape;
    const color = nextPiece.color;
    
    return (
      <div className="grid grid-cols-4 gap-0.5 border-2 border-gray-400 dark:border-gray-600 p-1 bg-gray-200 dark:bg-gray-700">
        {shape.flat().map((cell, index) => (
          <div
            key={index}
            className={`w-3 h-3 ${cell === 0 ? 'bg-gray-100 dark:bg-gray-800' : color}`}
          />
        ))}
      </div>
    );
  };

  // Add touch controls for mobile
  const handleTouchLeft = () => moveTetromino(-1);
  const handleTouchRight = () => moveTetromino(1);
  const handleTouchDown = () => dropTetromino();
  const handleTouchRotate = () => rotateTetromino();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tetris</h2>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Game board */}
        <div className="relative">
          {renderBoard()}
          
          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
              <p className="text-white text-2xl font-bold mb-4">Game Over</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-4 py-2 bg-notion-600 text-white rounded-lg"
              >
                Play Again
              </motion.button>
            </div>
          )}
          
          {/* Mobile touch controls */}
          <div className="flex justify-between mt-4 md:hidden">
            <button 
              onTouchStart={handleTouchLeft}
              className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
            >
              ←
            </button>
            <button 
              onTouchStart={handleTouchDown}
              className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
            >
              ↓
            </button>
            <button 
              onTouchStart={handleTouchRotate}
              className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
            >
              ↑
            </button>
            <button 
              onTouchStart={handleTouchRight}
              className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>
        
        {/* Game info */}
        <div className="flex flex-col space-y-4">
          {/* Score and level */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{score}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{level}</p>
            </div>
          </div>
          
          {/* Next piece */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Next Piece</p>
            {renderNextPiece()}
          </div>
          
          {/* Controls */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Controls</p>
            <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <p>↑ Rotate</p>
              <p>← → Move</p>
              <p>↓ Drop</p>
            </div>
          </div>
          
          {/* Game controls */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="flex items-center space-x-1 px-4 py-2 bg-notion-600 hover:bg-notion-700 text-white rounded-lg"
            >
              <SafeIcon icon={playing ? FiPause : FiPlay} className="w-4 h-4" />
              <span>{gameStarted ? (playing ? 'Pause' : 'Resume') : 'Start'}</span>
            </motion.button>
            {gameStarted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <SafeIcon icon={FiRotateCcw} className="w-4 h-4" />
                <span>Restart</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;