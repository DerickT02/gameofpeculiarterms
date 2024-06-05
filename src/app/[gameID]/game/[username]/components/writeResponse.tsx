//w
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import socketconn from "@/app/socket";

interface ResponseData {
    imageUrl: string;
    username: string;
    gameID: string
}

export default function WriteResponse({imageUrl, username, gameID}: ResponseData){
    const [prompt, setPrompt] = useState("")

    return (
        <div>
            <img src = {imageUrl}></img>
            <input value = {prompt}></input>
        </div>
    )
}