"use client"

import Image from "next/image";
import socket from "../socket";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";





export default function Page() {
    const router = useRouter()
    const [id, setId] = useState(0)
    const [userName, setUserName] = useState("")
    const [roomID, setRoomID] = useState("")

   

    const joinRoom = () => {
      socket.emit("join-room", {username: userName, roomID: roomID})
      router.push(`${roomID}/lobby`)
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

    
      </div>
        
   
     
    </div>
  );
}
