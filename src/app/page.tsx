"use client"

import Image from "next/image";
import socket from "./socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [serverMessage, setServerMessage] = useState("")

  useEffect(() => {
    socket.on("sayHello", (args: string) => {
      setServerMessage(args)
      console.log(serverMessage)
    })

  }, [serverMessage])

  const sayHello = () => {
    socket.emit("hello", "derick")
  };
  return (
    <>
      <h2>Server says {serverMessage}</h2>
      <button onClick={sayHello}>Say Hi to the server</button>
      <h1>Hello World</h1>
    </>
  );
}
