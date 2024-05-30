import { io } from "socket.io-client";

const socketconn = io("localhost:3001");

export default socketconn;