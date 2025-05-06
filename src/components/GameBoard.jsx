import React, { useState, useEffect } from 'react';
import './GameBoard.css';

const initialMap = [
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1]
];

const GameBoard = () => {
  const gridSize = 10;
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [bombs, setBombs] = useState([]);
  const [explosions, setExplosions] = useState([]);

  const isMovable = (row, col) => {
    return (
      row >= 0 &&
      row < gridSize &&
      col >= 0 &&
      col < gridSize &&
      initialMap[row][col] !== 1
    );
  };

  const handleKeyDown = (e) => {
    let { row, col } = playerPos;

    if (e.key === 'ArrowUp' && isMovable(row - 1, col)) row--;
    if (e.key === 'ArrowDown' && isMovable(row + 1, col)) row++;
    if (e.key === 'ArrowLeft' && isMovable(row, col - 1)) col--;
    if (e.key === 'ArrowRight' && isMovable(row, col + 1)) col++;

    setPlayerPos({ row, col });

    if (e.code === 'Space') {
      dropBomb(row, col);
    }
  };

  const dropBomb = (row, col) => {
    const alreadyDropped = bombs.some(b => b.row === row && b.col === col);
    if (alreadyDropped) return;

    setBombs(prev => [...prev, { row, col }]);

    // Bombayı 3 saniye sonra patlat
    setTimeout(() => {
      triggerExplosion(row, col);
      setBombs(prev => prev.filter(b => b.row !== row || b.col !== col));
    }, 3000);
  };

  const triggerExplosion = (row, col) => {
    const explosionArea = [{ row, col }];
    const directions = [
      { dr: -1, dc: 0 }, // up
      { dr: 1, dc: 0 },  // down
      { dr: 0, dc: -1 }, // left
      { dr: 0, dc: 1 }   // right
    ];

    directions.forEach(({ dr, dc }) => {
      for (let i = 1; i <= 2; i++) { // 2 birim menzil
        const nr = row + dr * i;
        const nc = col + dc * i;

        if (
          nr < 0 || nr >= gridSize ||
          nc < 0 || nc >= gridSize ||
          initialMap[nr][nc] === 1
        ) {
          break; // taş varsa patlama burada durur
        }

        explosionArea.push({ row: nr, col: nc });
      }
    });

    setExplosions(prev => [...prev, ...explosionArea]);

    // 0.5 saniye sonra patlamayı kaldır
    setTimeout(() => {
      setExplosions(prev =>
        prev.filter(pos => !explosionArea.some(e => e.row === pos.row && e.col === pos.col))
      );
    }, 500);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, bombs]);

  const cells = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const isStone = initialMap[row][col] === 1;
      const isPlayer = playerPos.row === row && playerPos.col === col;
      const isBomb = bombs.some(b => b.row === row && b.col === col);
      const isExplosion = explosions.some(e => e.row === row && e.col === col);

      cells.push(
        <div
          key={`${row}-${col}`}
          className={`cell 
            ${isStone ? 'stone' : ''} 
            ${isPlayer ? 'player' : ''} 
            ${isBomb ? 'bomb' : ''} 
            ${isExplosion ? 'explosion' : ''}`}
        />
      );
    }
  }

  return <div className="game-board">{cells}</div>;
};

export default GameBoard;
