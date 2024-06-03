"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import socketconn from "@/app/socket";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { gameID: string, username: string } }) {
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [players, setPlayers] = useState<any[]>([]);
    const [gameOver, setGameOver] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // Fetch the initial game state
        axios.get(`http://localhost:1001/gptgame/room/${params.gameID}`).then(res => {
            setPlayers(res.data.players);
            setCurrentPlayer(res.data.players[0].username);
        });

        // Listen for turn changes
        socketconn.on("turn_change", () => {
            setCurrentPlayerIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % players.length;
                setCurrentPlayer(players[newIndex].username);
                return newIndex;
            });
        });

        return () => {
            console.log("Component is unmounting...");
            socketconn.off("turn_change"); // Clean up the socket listener on unmount
        };
    }, [params.gameID, players.length]);

    const nextPlayer = () => {
        socketconn.emit("player_change", { gameId: params.gameID });
    };

    const leaveGame = () => {
        socketconn.emit("leave_game", { roomID: params.gameID, username: params.username });
        router.push("/");
    };

    return (
        <div>
            <button onClick={leaveGame}>Leave game</button>
            <br />
            {currentPlayer === params.username ? (
                <button onClick={nextPlayer}>Next Player</button>
            ) : (
                "Other Player's turn"
            )}
            <h2>Welcome To Game</h2>
        </div>
    );
}
