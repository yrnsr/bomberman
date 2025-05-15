import React, { useState, useEffect, useRef } from 'react';
import './GameBoard.css';
/**/ 
const initialMapTemplate = [
  [0, 0, 2, 2, 2, 0, 2, 0, 2, 2, 0],
  [0, 1, 2, 1, 2, 1, 2, 1, 0, 1, 0],
  [0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0],
  [2, 1, 2, 1, 2, 1, 2, 1, 0, 1, 0],
  [2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0],
  [2, 1, 2, 1, 0, 1, 2, 1, 2, 1, 0],
  [2, 2, 2, 0, 2, 2, 0, 2, 2, 0, 0],
  [0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0],
  [2, 0, 2, 0, 2, 2, 2, 2, 0, 0, 0],
  [2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0]
];

const GameBoard = () => {
  const gridSize = 10;
  const [map, setMap] = useState(initialMapTemplate.map(row => [...row]));
  const [playerPos, setPlayerPos] = useState({ row: 0, col: 0 });
  const [otherPlayers, setOtherPlayers] = useState({});
  const [bombs, setBombs] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [scorePlayer1, setScorePlayer1] = useState(0);
  const [scorePlayer2] = useState(0);

  const socketRef = useRef(null);
  const playerId = useRef(`player_${Math.floor(Math.random() * 100000)}`);

  const isMovable = (row, col) => {
    return (
      row >= 0 &&
      row < gridSize &&
      col >= 0 &&
      col < gridSize &&
      map[row][col] !== 1 &&
      map[row][col] !== 2
    );
  };

  const handleKeyDown = (e) => {
    let { row, col } = playerPos;
    let moved = false;

    if (e.key === 'ArrowUp' && isMovable(row - 1, col)) { row--; moved = true; }
    if (e.key === 'ArrowDown' && isMovable(row + 1, col)) { row++; moved = true; }
    if (e.key === 'ArrowLeft' && isMovable(row, col - 1)) { col--; moved = true; }
    if (e.key === 'ArrowRight' && isMovable(row, col + 1)) { col++; moved = true; }

    if (moved) {
      const newPos = { row, col };
      setPlayerPos(newPos);
      sendPosition(newPos);
    }

    if (e.code === 'Space') {
      dropBomb(row, col);
    }
  };

  const sendPosition = (position) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'move',
        playerId: playerId.current,
        position
      }));
    }
  };

  const dropBomb = (row, col) => {
    const alreadyDropped = bombs.some(b => b.row === row && b.col === col);
    if (alreadyDropped) return;

    setBombs(prev => [...prev, { row, col }]);

    setTimeout(() => {
      triggerExplosion(row, col);
      setBombs(prev => prev.filter(b => b.row !== row || b.col !== col));
    }, 3000);
  };

  const triggerExplosion = (row, col) => {
    const explosionArea = [{ row, col }];
    const directions = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ];

    const newMap = map.map(r => [...r]);

    directions.forEach(({ dr, dc }) => {
      for (let i = 1; i <= 2; i++) {
        const nr = row + dr * i;
        const nc = col + dc * i;

        if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) break;
        if (newMap[nr][nc] === 1) break;

        explosionArea.push({ row: nr, col: nc });

        if (newMap[nr][nc] === 2) {
          newMap[nr][nc] = 0;
          setScorePlayer1(prev => prev + 10);
          break;
        }
      }
    });

    setMap(newMap);
    setExplosions(prev => [...prev, ...explosionArea]);

    setTimeout(() => {
      setExplosions(prev =>
        prev.filter(pos => !explosionArea.some(e => e.row === pos.row && e.col === pos.col))
      );
    }, 500);
  };

  const resetGame = () => {
    setMap(initialMapTemplate.map(row => [...row]));
    setPlayerPos({ row: 0, col: 0 });
    setBombs([]);
    setExplosions([]);
  };

  const newGame = () => {
    resetGame();
    setScorePlayer1(0);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, bombs, map]);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.onopen = () => {
      console.log('Bağlantı kuruldu');
      sendPosition(playerPos);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'move' && data.playerId !== playerId.current) {
        setOtherPlayers(prev => ({ ...prev, [data.playerId]: data.position }));
      }
    };

    socketRef.current.onerror = (err) => {
      console.error('WebSocket hatası:', err);
    };

    socketRef.current.onclose = () => {
      console.log('Bağlantı kapandı');
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const cells = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellValue = map[row][col];
      const isStone = cellValue === 1;
      const isDestructible = cellValue === 2;
      const isPlayer = playerPos.row === row && playerPos.col === col;
      const isOtherPlayer = Object.values(otherPlayers).some(p => p.row === row && p.col === col);
      const isBomb = bombs.some(b => b.row === row && b.col === col);
      const isExplosion = explosions.some(e => e.row === row && e.col === col);

      cells.push(
        <div
          key={`${row}-${col}`}
          className={`cell 
            ${isStone ? 'stone' : ''} 
            ${isDestructible ? 'destructible' : ''}
            ${isPlayer ? 'player' : ''} 
            ${isOtherPlayer ? 'other-player' : ''} 
            ${isBomb ? 'bomb' : ''} 
            ${isExplosion ? 'explosion' : ''}`}
        />
      );
    }
  }

  return (
    <div>
      <div className="scoreboard">
        <h2>Skor Tablosu</h2>
        <div className="scores">
          <p>🎮 Oyuncu 1: {scorePlayer1}</p>
          <p>👾 Oyuncu 2: {scorePlayer2}</p>
        </div>
        <div className="buttons">
          <button onClick={resetGame}>🔁 Tekrar Oyna</button>
          <button onClick={newGame}>🆕 Yeni Oyun</button>
        </div>
      </div>
      <div className="game-board">
        {cells}
      </div>
    </div>
  );
};

export default GameBoard;
