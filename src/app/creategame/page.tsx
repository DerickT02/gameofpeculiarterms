"use client"

import Image from "next/image";
import socket from "../socket";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../Context/store";

export default function Page() {
    const router = useRouter();
    const [id, setId] = useState(0)
    const [userName, setUserName] = useState("")
    const [roomID, setRoomID] = useState("")
    const [maxPlayers, setMaxPlayers] = useState(0)
    const [winningScore, setWinningScore] = useState(0)
    const gameContext = useGlobalContext();


    const joinRoom = () => {
      gameContext?.setCurrentPlayer(userName)
      socket.emit("create-room", {username: userName, roomID: roomID, maxPlayers: maxPlayers, winningScore: winningScore})
      router.push(`${roomID}/lobby/${userName}`)
    }
    
    const changeUserName = (e: any) => {
      setUserName(((e.target as HTMLInputElement).value) as string)
    }

    const changeID = (e: any) => {
      setRoomID((e.target as HTMLInputElement).value as string)
    }

    const changeMaxPlayers = (e: any) => {
      setMaxPlayers(parseInt((e.target as HTMLInputElement).value as string))
    }

    const changeWinningScore = (e: any) => {
      setWinningScore(parseInt((e.target as HTMLInputElement).value as string))
    }
 


  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h2 className = "text-6xl mb-8">Create Game</h2>
      <div className = "flex flex-col justify-center items-center">
      <input onChange = {changeUserName}  value = {userName} className = "border border-black w-60 h-10 mb-3" placeholder="Enter Username"></input>
        <input className = "border border-black w-60 h-10 mb-3" type = "number" max={6} placeholder="# Players (max. 6)"  onChange = {changeMaxPlayers}></input>
        <input className = "border border-black w-60 h-10 mb-3" type = "number" max={7} placeholder="Winning Score (max. 7)"  onChange = {changeWinningScore}></input>
        <input onChange = {changeID} value = {roomID} className = "border border-black w-60 h-10 mb-3" placeholder="Enter 6 digit ID here"></input>
        <button className = "bg-black white text-white rounded-xl mb-3 w-60 h-10" onClick={joinRoom}>Create</button>
      </div>
    </div>
  );
}
