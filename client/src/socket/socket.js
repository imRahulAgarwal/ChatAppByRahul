import { io } from "socket.io-client";
import { socketServer } from "../conf/conf";

const socket = io(socketServer);
export default socket;
