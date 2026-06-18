import React from 'react';
import { BOARD_SPACES } from '../gameData';

const GameBoard = ({ players, currentPlayerId }) => {
  // Map player positions to coordinates based on the 40-space board
  // 0-9: Bottom (Right to Left)
  // 10-19: Left (Bottom to Top)
  // 20-29: Top (Left to Right)
  // 30-39: Right (Top to Bottom)
  
  const getSpaceCoords = (pos) => {
    if (pos >= 0 && pos <= 10) return { x: 1000 - (pos * 100), y: 1000 };
    if (pos > 10 && pos <= 20) return { x: 0, y: 1000 - ((pos - 10) * 100) };
    if (pos > 20 && pos <= 30) return { x: (pos - 20) * 100, y: 0 };
    if (pos > 30 && pos < 40) return { x: 1000, y: (pos - 30) * 100 };
    return { x: 1000, y: 1000 };
  };

  return (
    <div className="relative w-full max-w-[600px] aspect-square bg-neutral-900 border-4 border-pink-400 rounded-lg overflow-hidden shadow-2xl">
      <img src="/board.svg" className="w-full h-full" alt="Game Board" />
      
      {/* Player Markers */}
      {Object.values(players).map((player, index) => {
        const coords = getSpaceCoords(player.pos);
        // Offset multiple players on the same space
        const offsetX = (index % 3) * 20 - 20;
        const offsetY = Math.floor(index / 3) * 20 - 20;
        
        return (
          <div
            key={player.id}
            className={`absolute transition-all duration-500 ease-in-out w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-lg
              ${player.id === currentPlayerId ? 'bg-pink-500 border-white scale-110 z-10' : 'bg-blue-500 border-neutral-800 opacity-80'}`}
            style={{
              left: `calc(${(coords.x + 50) / 1100 * 100}% + ${offsetX}px)`,
              top: `calc(${(coords.y + 50) / 1100 * 100}% + ${offsetY}px)`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
