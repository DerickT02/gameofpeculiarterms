'use client'

import Image from "next/image";
import socketconn from "./socket";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createContext } from "react";
import { useGlobalContext } from "./Context/store";




export default function HomePage() {
  const [serverMessage, setServerMessage] = useState("")
  
 


  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className = "text-6xl mb-12">Game of Peculiar Terms</h1>
      <div className = "flex flex-col">
        <Link href = "/creategame"><button className = "bg-black white text-white rounded-xl mb-3 w-72 h-20">Create Game</button></Link>
        <Link href = "/joingame"><button className = "border border-black rounded-xl mb-3 w-72 h-20">Join Game</button></Link>
      </div>
        

     
    </div>
  );
}
