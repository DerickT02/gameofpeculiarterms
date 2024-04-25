import { io } from "socket.io-client";

const socket = io("localhost:7001");

export default socket;