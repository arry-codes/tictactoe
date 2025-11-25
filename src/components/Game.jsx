import React, { useEffect, useState } from 'react';
import { database, ref, onValue, update, set, remove, onDisconnect } from '../firebase';

const Game = ({ roomId, playerSymbol, playerName, onLeave }) => {
    const [game, setGame] = useState(null);
    const [status, setStatus] = useState('Loading...');
    const [opponentLeft, setOpponentLeft] = useState(false);

    useEffect(() => {
        const gameRef = ref(database, `games/${roomId}`);
        const playerRef = ref(database, `games/${roomId}/players/${playerSymbol}`);


        onDisconnect(playerRef).remove();

        const unsubscribe = onValue(gameRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setGame(data);


                const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
                if (data.players && !data.players[opponentSymbol] && !data.winner && !data.draw) {

                }
            } else {
                setStatus('Game ended or does not exist.');
            }
        });

        return () => {
            unsubscribe();

            onDisconnect(playerRef).cancel();
        };
    }, [roomId, playerSymbol]);


    useEffect(() => {
        if (game && game.players) {
            const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
            const opponent = game.players[opponentSymbol];



            if (playerSymbol === 'O' && !game.players.X) {
                setOpponentLeft(true);
            }
            if (playerSymbol === 'X' && game.players.O === undefined && game.board.some(cell => cell !== "")) {

                setOpponentLeft(true);
            }
        }
    }, [game, playerSymbol]);

    const handleLeave = async () => {
        // Remove myself from the game
        await remove(ref(database, `games/${roomId}/players/${playerSymbol}`));
        onLeave();
    };

    const handleClick = (i) => {
        if (!game || game.winner || game.board[i] || opponentLeft) return;

        const isMyTurn = (game.xIsNext && playerSymbol === 'X') || (!game.xIsNext && playerSymbol === 'O');

        if (!isMyTurn) return;

        // Check if opponent is present
        if (!game.players || !game.players.O || !game.players.X) {
            alert("Waiting for opponent to join!");
            return;
        }

        const newBoard = [...game.board];
        newBoard[i] = playerSymbol;

        const winner = calculateWinner(newBoard);
        const isDraw = !winner && newBoard.every(cell => cell !== "");

        const updates = {
            [`games/${roomId}/board`]: newBoard,
            [`games/${roomId}/xIsNext`]: !game.xIsNext,
        };

        if (winner) {
            updates[`games/${roomId}/winner`] = winner;
        } else if (isDraw) {
            updates[`games/${roomId}/draw`] = true;
        }

        update(ref(database), updates);
    };

    const resetGame = () => {
        const updates = {
            [`games/${roomId}/board`]: Array(9).fill(""),
            [`games/${roomId}/xIsNext`]: true,
            [`games/${roomId}/winner`]: null,
            [`games/${roomId}/draw`]: false
        };
        update(ref(database), updates);
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        alert("Room ID copied to clipboard!");
    };

    if (!game) return <div className="loading">{status}</div>;

    const winner = game.winner;
    const isDraw = game.draw;
    const isMyTurn = (game.xIsNext && playerSymbol === 'X') || (!game.xIsNext && playerSymbol === 'O');

    let statusText = '';
    if (opponentLeft) {
        statusText = "Opponent Left the Game";
    } else if (winner) {
        statusText = winner === playerSymbol ? 'You Won!' : 'You Lost!';
    } else if (isDraw) {
        statusText = "It's a Draw!";
    } else {
        statusText = isMyTurn ? "Your Turn" : "Opponent's Turn";
    }

    return (
        <div className="game-container">
            <div className="header">
                <div className="player-info">
                    <span className={`badge ${playerSymbol === 'X' ? 'x-badge' : 'o-badge'}`}>You are {playerSymbol}</span>
                    <span className="vs">VS</span>
                    <span className="opponent-name">
                        {playerSymbol === 'X' ? (game.players?.O ? game.players.O.name : 'Waiting...') : (game.players?.X ? game.players.X.name : 'Left')}
                    </span>
                </div>
                <div className="room-info">
                    <span>Room: {roomId}</span>
                    <button className="icon-btn" onClick={copyRoomId} title="Copy Room ID">📋</button>
                </div>
            </div>

            <div className="status-bar">
                <h2 style={{ color: opponentLeft ? 'var(--error-color)' : 'inherit' }}>{statusText}</h2>
            </div>

            <div className="board">
                {(game.board || Array(9).fill("")).map((square, i) => (
                    <button
                        key={i}
                        className={`square ${square ? square.toLowerCase() : ''} ${!square && isMyTurn && !winner && !opponentLeft ? 'hoverable' : ''}`}
                        onClick={() => handleClick(i)}
                        disabled={!!winner || !!opponentLeft}
                    >
                        {square}
                    </button>
                ))}
            </div>

            {(winner || isDraw || opponentLeft) && (
                <div className="game-over-actions">
                    {!opponentLeft && <button className="btn primary" onClick={resetGame}>Play Again</button>}
                </div>
            )}

            <button className="btn text-btn" onClick={handleLeave}>Leave Game</button>
        </div>
    );
};

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default Game;
