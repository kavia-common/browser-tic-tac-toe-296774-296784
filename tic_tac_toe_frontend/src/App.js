import React, { useMemo, useState } from 'react';
import './App.css';
import Board from './components/Board';
import { getGameState, getStatusText } from './lib/game';
import { getEnv } from './lib/env';

const INITIAL_SQUARES = Array(9).fill(null);

function buildHistoryEntry(squares, lastMoveIndex) {
  return { squares, lastMoveIndex };
}

function moveLabel(moveIndex, entry) {
  if (moveIndex === 0) return 'Go to game start';
  if (entry?.lastMoveIndex === null || entry?.lastMoveIndex === undefined) return `Go to move #${moveIndex}`;
  const row = Math.floor(entry.lastMoveIndex / 3) + 1;
  const col = (entry.lastMoveIndex % 3) + 1;
  return `Go to move #${moveIndex} (${row}, ${col})`;
}

// PUBLIC_INTERFACE
function App() {
  /** Main Tic Tac Toe app (Ocean Professional theme). */
  // Read env safely (optional, no hard dependency)
  const nodeEnv = getEnv('REACT_APP_NODE_ENV', 'production');

  // History state for time travel
  const [history, setHistory] = useState([buildHistoryEntry(INITIAL_SQUARES, null)]);
  const [currentMove, setCurrentMove] = useState(0);

  // Score state across rounds
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const current = history[currentMove];
  const squares = current.squares;

  const xIsNext = currentMove % 2 === 0;

  const derived = useMemo(() => getGameState(squares), [squares]);
  const statusText = useMemo(
    () => getStatusText({ winner: derived.winner, isDraw: derived.isDraw, xIsNext }),
    [derived.winner, derived.isDraw, xIsNext]
  );

  const isGameOver = Boolean(derived.winner || derived.isDraw);

  function handlePlaySquare(index) {
    if (isGameOver) return;
    if (squares[index] !== null) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';

    // If we time-traveled, discard "future" moves
    const nextHistory = history.slice(0, currentMove + 1);
    const nextMove = nextHistory.length;

    const nextEntry = buildHistoryEntry(nextSquares, index);
    const updatedHistory = [...nextHistory, nextEntry];

    setHistory(updatedHistory);
    setCurrentMove(nextMove);

    // If that move ended the round, update scores
    const { winner, isDraw } = getGameState(nextSquares);
    if (winner) {
      setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
    } else if (isDraw) {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function newGame() {
    setHistory([buildHistoryEntry(INITIAL_SQUARES, null)]);
    setCurrentMove(0);
  }

  function resetScore() {
    setScores({ X: 0, O: 0, draws: 0 });
    newGame();
  }

  const moves = history.map((entry, move) => {
    const isCurrent = move === currentMove;
    return (
      <li key={move}>
        <button
          type="button"
          className={['ttt-history__btn', isCurrent ? 'ttt-history__btn--active' : ''].join(' ')}
          onClick={() => jumpTo(move)}
          aria-current={isCurrent ? 'step' : undefined}
        >
          {moveLabel(move, entry)}
        </button>
      </li>
    );
  });

  return (
    <div className="App">
      <div className="ttt-shell">
        <header className="ttt-header">
          <div className="ttt-header__left">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Ocean Professional edition</p>
          </div>

          <div className="ttt-scores" aria-label="Scoreboard">
            <div className="ttt-scoreCard">
              <div className="ttt-scoreCard__label">X</div>
              <div className="ttt-scoreCard__value">{scores.X}</div>
            </div>
            <div className="ttt-scoreCard">
              <div className="ttt-scoreCard__label">O</div>
              <div className="ttt-scoreCard__value">{scores.O}</div>
            </div>
            <div className="ttt-scoreCard ttt-scoreCard--draws">
              <div className="ttt-scoreCard__label">Draws</div>
              <div className="ttt-scoreCard__value">{scores.draws}</div>
            </div>
          </div>
        </header>

        <main className="ttt-main">
          <section className="ttt-game">
            <div className="ttt-status" role="status" aria-live="polite">
              <span
                className={[
                  'ttt-status__pill',
                  derived.winner ? 'ttt-status__pill--winner' : '',
                  derived.isDraw ? 'ttt-status__pill--draw' : '',
                ].join(' ')}
              >
                {statusText}
              </span>

              {nodeEnv !== 'production' ? (
                <span className="ttt-status__env" aria-label="Environment">
                  env: {nodeEnv}
                </span>
              ) : null}
            </div>

            <div className="ttt-stage">
              <div className="ttt-boardWrap" aria-label="Game board">
                <Board
                  squares={squares}
                  onPlaySquare={handlePlaySquare}
                  disabled={isGameOver}
                  winningLine={derived.winningLine}
                />
              </div>

              <aside className="ttt-history" aria-label="Move history">
                <div className="ttt-panelTitle">Move history</div>
                <ol className="ttt-history__list">{moves}</ol>
              </aside>
            </div>

            <div className="ttt-controls" aria-label="Game controls">
              <button type="button" className="ttt-btn ttt-btn--primary" onClick={newGame}>
                New Game
              </button>
              <button type="button" className="ttt-btn ttt-btn--ghost" onClick={resetScore}>
                Reset Score
              </button>
            </div>
          </section>
        </main>

        <footer className="ttt-footer">
          <span>Built with React. No backend required.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
