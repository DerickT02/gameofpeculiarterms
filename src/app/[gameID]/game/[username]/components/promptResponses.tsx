"use client"

import socketconn from "@/app/socket";
import { useState } from "react";


interface Response {
    response: string;
    username: string;
    currentScore: number;
    gameID: string;
}

export default function PromptResponse({response, username, currentScore, gameID}: Response){
    const [buttonClicked, setButtonClicked] = useState(false);
   
    const updateScore = () => {
        socketconn.emit("update_score", {username: username, updateScore: currentScore + 1,  gameID: gameID});
        setButtonClicked(false)
    }

    return (
        <>
            {!buttonClicked ? 
            <>
                <button onClick={() => {setButtonClicked(prev => !prev)}}>{response}</button>
            </>
            : 
            <>
                <button onClick = {updateScore}>✔︎</button>
                <button onClick = {() => setButtonClicked(false)}>ⅹ</button>
            </>
            }
            
        </>
    )
}