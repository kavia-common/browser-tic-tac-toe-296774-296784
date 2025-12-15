import React from 'react';

// PUBLIC_INTERFACE
export default function Square({ value, onClick, disabled, highlight, index }) {
  /** Single square for the Tic Tac Toe board. */
  const ariaLabel = value ? `Square ${index + 1}: ${value}` : `Square ${index + 1}: empty`;

  return (
    <button
      type="button"
      className={[
        'ttt-square',
        highlight ? 'ttt-square--highlight' : '',
        value === 'X' ? 'ttt-square--x' : '',
        value === 'O' ? 'ttt-square--o' : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <span className="ttt-square__value" aria-hidden="true">
        {value}
      </span>
    </button>
  );
}
