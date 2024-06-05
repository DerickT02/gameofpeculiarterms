"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import socketconn from "@/app/socket";
import { useRouter } from "next/navigation";
import WriteResponse from "./components/writeResponse";

export default function Page({ params }: { params: { gameID: string, username: string } }) {
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [players, setPlayers] = useState<any[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [promptWritten, setIsPromptWritten] = useState(false)
    const [promptGenerated, setPromptGenerated] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [promptImage, setPromptImage] = useState("")
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

        socketconn.on("prompt_generated", (data) => {
            console.log(data.promptImage)
            setPromptGenerated(true)
            
            setPromptImage(data.promptImage)
        })

        return () => {
            console.log("Component is unmounting...");
            socketconn.off("turn_change"); 
            socketconn.off("prompt_generated")
        };
    }, [params.gameID, players.length]);

    const generatePrompt = () => {
        setIsPromptWritten(true)
        socketconn.emit("generate_prompt", {username: params.username, prompt: prompt, gameId: params.gameID})
    }

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
            {!gameOver ?  
            <>
            {currentPlayer === params.username ? (
               <>
                {!promptWritten ? 
                <> 
                    <h1>It's your turn!!</h1>
                    
                    
                    <input placeholder="Write a prompt" value = {prompt} onChange = {(e) => {setPrompt(e.target.value)}}></input>
                    <button onClick = {generatePrompt}>Generate Prompt</button>
                </> 
                : 
                <> <button onClick={nextPlayer}>Next Player</button></>
                }
       
               </>
                
                ) : (
               <>
               {!promptGenerated ? <>
               <h3>Waiting for {currentPlayer} to generate a prompt</h3> 
               <h2>What will {params.username} say???? (This may take a few minutes. Please be patient)</h2></> : 
               <> 
                
                <WriteResponse imageUrl={promptImage} username={params.username} gameID={params.gameID} />
               </>
               }
               </>
                )
            }
            </> : 
            <>
                <h1>Game over</h1>
                <button onClick = {leaveGame}>Exit</button>
            </>
            
            }
            
            
        </div>
    );
}
