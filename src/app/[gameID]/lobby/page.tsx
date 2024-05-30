"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import socketconn from "@/app/socket";
import { GlobalContext, useGlobalContext } from "@/app/Context/store";

export default function Page({ params }: { params: { gameID: string } }) {
    const [players, setPlayers] = useState<any[]>([]);
    const gameContext = useGlobalContext()

    useEffect(() => {
        axios.get(`http://localhost:1001/gptgame/room/${params.gameID}`).then(res => {
            setPlayers(res.data.players)
        })
        socketconn.on('player-joined', (res) => {
            console.log(res)
            setPlayers(res.players)
        })
    })
    return (
        <div>
            <h1>Game ID: {params.gameID}</h1>
            <h2>Username: {gameContext?.username}</h2>
            <h3>In the lobby, do not refresh page</h3>
            <ol>
            {players.map((player, index) => {
                return (
                    <>
                    <li key = {index}>{player.username}</li>
                    </>
                )
            })}
            </ol>
        </div>
    )
}