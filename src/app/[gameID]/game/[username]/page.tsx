"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import socketconn from "@/app/socket";
import { useRouter } from "next/navigation";
import WriteResponse from "./components/writeResponse";
import PromptResponse from "./components/promptResponses";

export default function Page({ params }: { params: { gameID: string, username: string } }) {
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [currentScore, setCurrentScore] = useState(0);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [players, setPlayers] = useState<any[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [promptWritten, setIsPromptWritten] = useState(false);
    const [promptGenerated, setPromptGenerated] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [promptImage, setPromptImage] = useState("");
    const [responses, setResponses] = useState<any[]>([]);
    const [imageLoading, setImageLoading] = useState(false);
    const [winningScore, setWinningScore] = useState(0)
    const [winner, setWinner] = useState("")
    const router = useRouter();
    const [scoreboard, setScoreboard] = useState({})

    useEffect(() => {
        // Fetch the initial game state
        axios.get(`http://localhost:1001/gptgame/room/${params.gameID}`).then(res => {
            setPlayers(res.data.players);
            setCurrentPlayer(res.data.players[0].username);
            setWinningScore(res.data.winningScore)
            setCurrentScore(res.data.scores[params.username])
            });

        // Listen for turn changes
        socketconn.on("turn_change", () => {
            setPromptImage("");
            setIsPromptWritten(false);
            setPromptGenerated(false);
            setResponses([])
            setCurrentPlayerIndex(prevIndex => {
                const newIndex = (prevIndex + 1) % players.length;
                setCurrentPlayer(players[newIndex].username);
                return newIndex;
            });
        });

        socketconn.on("prompt_generated", (data) => {
            setPromptGenerated(true);
            setImageLoading(false);
            setPromptImage(data.promptImage);
        });

        socketconn.on("response_given", (data: any) => {
            console.log(data)
            setResponses(prev => [...prev, data])

           
        });

        socketconn.on("score_updated", (data) => {
            if(params.username == data.score){
                console.log("Event triggered")
                setCurrentScore(data.score)
            }
    
            console.log("current score", currentScore)
        })

        socketconn.on("game_over", data => {
            setGameOver(true)
            setWinner(data.winner)
        })

        return () => {
            socketconn.off("turn_change");
            socketconn.off("prompt_generated");
            socketconn.off("response_given");
            socketconn.off("score_updated")
            socketconn.off("game_over")
        };
    }, [params.gameID, players.length]);

    const generatePrompt = () => {
        setIsPromptWritten(true);
        setImageLoading(true);
        setPrompt("")
        socketconn.emit("generate_prompt", { username: params.username, prompt: prompt, gameId: params.gameID });
    };

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
            {!gameOver ? (
                <>
                    {currentPlayer === params.username ? (
                        <>
                            {!promptWritten ? (
                                <>
                                    <h1>It's your turn!!</h1>
                                    <input placeholder="Write a prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                                    <button onClick={generatePrompt}>Generate Prompt</button>
                                </>
                            ) : (
                                <>
                                    {imageLoading ? (
                                        "Loading image"
                                    ) : (
                                        <>
                                            <img src={promptImage} alt="Prompt" />
                                            <button onClick={nextPlayer}>Next Player</button>
                                            {responses.map((value, index) => (
                                                <PromptResponse username={value.username} currentScore={value.score} response={value.response} gameID = {params.gameID}/>
                                            ))}
                                        </> 
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {!promptGenerated ? (
                                <>
                                    <h3>Waiting for {currentPlayer} to generate a prompt</h3>
                                    <h2>What will {params.username} say???? (This may take a few minutes. Please be patient)</h2>
                                </>
                            ) : (
                                /*set the score equal to the current score by fetching use score from the Map */
                                <WriteResponse imageUrl={promptImage} username={params.username} gameID={params.gameID}/>
                            )}
                        </>
                    )}
                </>
            ) : (
                <>
                    <h1>Game over</h1>
                    <button onClick={leaveGame}>Exit</button>
                </>
            )}
        </div>
    );
}
