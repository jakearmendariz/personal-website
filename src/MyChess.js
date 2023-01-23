import { useRef, useState } from 'react';
import Chess from 'chess.js';

import { Chessboard } from 'react-chessboard';

export default function PlayVsAI({ boardWidth }) {
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentTimeout, setCurrentTimeout] = useState(undefined);
  const [move, setMove] = useState('');

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      console.log(possibleMoves[randomIndex]);
      game.move(possibleMoves[randomIndex]);
    });
  }

  function makeMove(event) {
    event.preventDefault();
    console.log("make move", move)
    safeGameMutate((game) => {
      game.move(move);
    });
    // setMove("")
  }

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen for example simplicity
    });
    console.log(move)
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(askAI, 200);
    setCurrentTimeout(newTimeout);
    console.log(game.fen())
    return true;
  }


  function askAI() {
    fetch(`http://127.0.0.1:8080/${game.fen()}`)
      .then(response => response.json())
      .then(move_json => {
        const gameCopy = { ...game };
        console.log(move_json);
        if (move_json["sourceSquare"] == null) {
          console.log("checkmate")
        }
        const move = gameCopy.move({
          from: move_json["sourceSquare"],
          to: move_json["targetSquare"],
          promotion: 'q' // always promote to a queen for example simplicity
        });
        console.log(move)
        setGame(gameCopy);
    });
  }

  return (
    <div>
      <Chessboard
        id="PlayVsAI"
        animationDuration={200}
        boardOrientation={boardOrientation}
        boardWidth={boardWidth}
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
        ref={chessboardRef}
      />
      <button
        className="rc-button"
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        reset
      </button>
      <button
        className="rc-button"
        onClick={() => {
          setBoardOrientation((currentOrientation) => (currentOrientation === 'white' ? 'black' : 'white'));
        }}
      >
        flip board
      </button>
      <button
        className="rc-button"
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        undo
      </button>
      <form onSubmit={makeMove}>
        Enter the next move
        <input 
          type="text"
          id="move"
          name="move"
          value={move}
          onChange={event => setMove(event.target.value)}
        />
        <button type="submit">Submit Move </button>
      </form>
      <button onClick={askAI}>
        Ask AI
      </button>
    </div>
  );
}