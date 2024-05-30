"use client"

import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext, useGlobalContext } from "../Context/store";
import socketconn from "../socket";






export default function Page() {
    const router = useRouter()
    const [id, setId] = useState(0)
    const [userName, setUserName] = useState("")
    const [roomID, setRoomID] = useState("")
    const [isErr, setIsErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const gameContext = useGlobalContext()
  
    useEffect(() => {
    
    }, [])
   

    const joinRoom = () => {
      axios.get(`http://localhost:1001/gptgame/room/${roomID}`).then(res => {
        if(res.data?.maxPlayers == res.data?.players.length){
          setIsErr(true)
          setErrMsg("Game already full")
          return
        }
        gameContext?.setCurrentPlayer(userName)

        socketconn.emit("join-room", {username: userName, roomID: roomID})
        router.push(`${roomID}/lobby`)

      })
      
    }
    
    const changeUserName = (e: any) => {
      setUserName(((e.target as HTMLInputElement).value) as string)
    }

    const changeID = (e: any) => {
      setRoomID((e.target as HTMLInputElement).value as string)
    }
 


  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h2 className = "text-6xl mb-8">Join Game</h2>
      <div className = "flex flex-col justify-center items-center">
        <input onChange = {changeUserName}  value = {userName} className = "border border-black w-60 h-10 mb-3" placeholder="Enter Username"></input>
        <input onChange = {changeID} value = {roomID} className = "border border-black w-60 h-10 mb-3" placeholder="Enter 6 digit ID here"></input>
        <button className = "bg-black white text-white rounded-xl mb-3 w-60 h-10" onClick={joinRoom}>Join</button>
        <h3>{isErr ? errMsg : ""}</h3>
    
      </div>
        
   
     
    </div>
  );
}
