"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import socketconn from "@/app/socket";
import { useGlobalContext } from "@/app/Context/store";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { gameID: string, username: string } }) {
    const [players, setPlayers] = useState<any[]>([]);
    const [creator, setCreator] = useState<string>("");
    const gameContext = useGlobalContext();
    const router = useRouter();
    const [localUsername, setLocalUsername] = useState<string | null>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem(params.username) || params.username;
        setLocalUsername(storedUsername);
        localStorage.setItem(params.username, storedUsername);

        const fetchGameRoom = async () => {
            try {
                const res = await axios.get(`http://localhost:1001/gptgame/room/${params.gameID}`);
                setPlayers(res.data.players);
                setCreator(res.data.creator.username);
            } catch (error) {
                console.error("Error fetching game room data:", error);
            }
        };

        fetchGameRoom();

        const handlePlayerJoined = (res: any) => {
            setPlayers(res.players);
        };

        const handleGameStarted = () => {
            router.push(`../game/${params.username}`);
        };

        socketconn.on('player-joined', handlePlayerJoined);
        socketconn.on("game_started", handleGameStarted);

        return () => {
            
            socketconn.off('game_started', handleGameStarted);
        };
    }, [params.gameID, params.username, router]);

    const startGame = () => {
        socketconn.emit("start_game", params.gameID);
    };

    return (
        <div>
            <h1>Game ID: {params.gameID}</h1>
            <h2>Username: {localUsername}</h2>
            <h3>In the lobby, do not refresh page</h3>
            <ol>
                {players.map((player, index) => (
                    <li key={`${index}_${player.username}`}>{player.username}</li>
                ))}
            </ol>
            {creator === params.username && <button onClick={startGame}>Start Game</button>}
        </div>
    );
}
