import React, { useState } from 'react';
import Lobby from './components/Lobby';
import Game from './components/Game';
import './index.css';

function App() {
  const [gameState, setGameState] = useState({
    roomId: null,
    playerSymbol: null,
    playerName: null,
    inGame: false
  });

  const handleJoinGame = (roomId, playerSymbol, playerName) => {
    setGameState({
      roomId,
      playerSymbol,
      playerName,
      inGame: true
    });
  };

  const handleLeaveGame = () => {
    setGameState({
      roomId: null,
      playerSymbol: null,
      playerName: null,
      inGame: false
    });
  };

  return (
    <div className="app">
      {gameState.inGame ? (
        <Game
          roomId={gameState.roomId}
          playerSymbol={gameState.playerSymbol}
          playerName={gameState.playerName}
          onLeave={handleLeaveGame}
        />
      ) : (
        <Lobby onJoinGame={handleJoinGame} />
      )}
    </div>
  );
}

export default App;
