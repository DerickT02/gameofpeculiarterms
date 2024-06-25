//w
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import socketconn from "@/app/socket";


interface ResponseData {
    imageUrl: string;
    username: string;
    gameID: string;
   
}

export default function WriteResponse({imageUrl, username, gameID}: ResponseData){
    const [prompt, setPrompt] = useState("")
    const [currentScore, setCurrentScore] = useState(0)

    useEffect(() => {
       axios.get(`http://localhost:1001/gptgame/room/${gameID}/${username}`).then(res => {
        setCurrentScore(res.data.playerScore)
        console.log("Can i see my score", currentScore)
       }) 
    }, [])
   
    const submitResponse = () => {
        
        socketconn.emit("response_sent", {gameID: gameID, prompt: prompt, username: username, currentScore: currentScore}, () => {
            console.log("event emitted")
        })
    }

    return (
        <div>
            <img src = {imageUrl}></img>
            <div className="relative w-64">
                    <input value = {prompt} onChange={(e) => setPrompt(e.target.value)} type="text" className="w-full border border-black rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Enter text..." />
                    <button className="absolute inset-y-0 right-0 flex items-center pr-3 bg-black text-white rounded-r-full" onClick = {submitResponse}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                    </button>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> 
                </div>
        </div>
    )
}