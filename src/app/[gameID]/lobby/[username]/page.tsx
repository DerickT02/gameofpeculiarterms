"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import socketconn from "@/app/socket";
import { GlobalContext, useGlobalContext } from "@/app/Context/store";
import { useRouter } from "next/navigation";


export default function Page({ params }: { params: { gameID: string, username: string } }) {
    const [players, setPlayers] = useState<any[]>([]);
    const [creator, setCreator] = useState<string>("");
    const gameContext = useGlobalContext()
    const router = useRouter();

    useEffect(() => {
        axios.get(`http://localhost:1001/gptgame/room/${params.gameID}`).then(res => {
            setPlayers(res.data.players)
            setCreator(res.data.creator.username)
        })
        localStorage.setItem(params.username, params.username);
        socketconn.on('player-joined', (res) => {
            console.log(res)
            setPlayers(res.players)
        })
        socketconn.on("game_started", (gameID) => {
            console.log("game started")
            if(gameID == params.gameID){
                router.push(`..//game/${params.username}`)
            }
           
    
        })
    
        

      
    })

    
   

    const startGame = () => {
        socketconn.emit("start_game", params.gameID)
    }
    return (
        <div>
            <h1>Game ID: {params.gameID}</h1>
            <h2>Username: {localStorage.getItem(params.username)}</h2>
            <h3>In the lobby, do not refresh page</h3>
            <ol>
            {players.map((player, index) => {
                return (
                    <>
                    <li key = {`${index}_${player}`}>{player.username}</li>
                    </>
                )
            })}

            {creator == params.username ? <button onClick = {startGame}>Start Game</button>: ""}
            </ol>
        </div>
    )
}