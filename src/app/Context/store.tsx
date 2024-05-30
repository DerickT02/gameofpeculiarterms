"use client"


import { createContext, SetStateAction, useActionState, useContext, useState, Dispatch, ReactNode } from "react";
import HomePage from "../page";


export interface Player {
    setCurrentPlayer: Dispatch<SetStateAction<string>>,
    username: string
   
    
}

export const GlobalContext = createContext<Player | null >(null);

export const GlobalContextProvider = ({ children }) => {
     const [currentPlayer, setCurrentPlayer] = useState("")
     
    

    return (
        <GlobalContext.Provider value = {{username: currentPlayer, setCurrentPlayer: setCurrentPlayer}}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);