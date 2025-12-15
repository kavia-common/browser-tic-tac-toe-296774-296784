import React from 'react';
import Square from './Square';

// PUBLIC_INTERFACE
export default function Board({ squares, onPlaySquare, disabled, winningLine }) {
  /** Renders 3x3 Tic Tac Toe board. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => {
        const highlight = Boolean(winningLine && winningLine.includes(idx));
        return (
          <div key={idx} role="row" className="ttt-board__cell">
            <Square
              value={value}
              index={idx}
              highlight={highlight}
              disabled={disabled || value !== null}
              onClick={() => onPlaySquare(idx)}
            />
          </div>
        );
      })}
    </div>
  );
}
