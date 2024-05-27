"use client"


import { createContext, SetStateAction, useActionState, useContext, useState, Dispatch, ReactNode } from "react";
import HomePage from "../page";

export interface Game {
    id: string,
    gameStarted: boolean,
    prompter: Player
    listOfPlayers: Player[]
    addPlayer: Dispatch<SetStateAction<Player[]>>
    setPrompter: Dispatch<SetStateAction<Player>>
}

export interface Player {
    username: string
    score: number
    gameId: string
    
}

export const GlobalContext = createContext<Game | null >(null);

export const GlobalContextProvider = ({ children }) => {
     const [gameStarted, setGameStarted] = useState(false)
     const [listOfPlayers, setListOfPlayers] = useState<[] | Player[]>([])
     const [prompter, setPrompter] = useState<Player>({
        username: "test",
        score: 0,
        gameId: "123456"
     })
     const [gameId, setGameId] = useState("123456")


     let value : Game = {id: gameId, gameStarted, prompter ,listOfPlayers, addPlayer: setListOfPlayers, setPrompter }

    return (
        <GlobalContext.Provider value = {value}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);