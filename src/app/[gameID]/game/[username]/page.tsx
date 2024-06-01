"use client"
import {useState, useEffect} from "react";
import axios from "axios";
import socketconn from "@/app/socket";

export default function Page({params}: { params: { gameID: string, username: string} }) {
  return(
    <div>
        <h2>Welcome To Game</h2>
    </div>
  )
  
}
