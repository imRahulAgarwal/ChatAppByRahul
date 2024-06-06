import "dotenv/config.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import http from "http";
import connectDatabase from "./utils/connectDatabase.js";
import { Server } from "socket.io";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);
const { PORT, ALLOWED_ORIGINS } = process.env;

const origin = ALLOWED_ORIGINS.split(",");

const io = new Server(server, { cors: { origin, allowedHeaders: ["Content-Type"] } });

app.use(cors({ origin }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDatabase();

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(errorMiddleware);

io.on("connection", (socket) => {
    socket.on("init", (user) => {
        socket.join(user._id);
    });

    socket.on("active-chat", (room) => {
        socket.join(room);
    });

    socket.on("start-typing", (room) => socket.in(room).emit("start-typing"));
    socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

    socket.on("new-message", ({ message, chat }) => {
        const newMessage = message.chatId;

        if (!newMessage.users) return;

        newMessage.users.forEach((user) => {
            if (user === message.senderId._id) return;
            socket.to(user).emit("message-received", { message, chat });
        });
    });

    // Will reflect in notifications
    socket.on("friend-request-send", (request) => {
        socket.to(request.receiver).emit("friend-request-received", request);
    });

    // Will decrease notification count
    socket.on("friend-request-removed", (request) => {
        socket.to(request.receiver).emit("friend-request-removed-by-sender", request);
    });

    // Will remove friend from friend list
    socket.on("friend-removed", (request) => {
        socket.to(request.friend).emit("friend-removed", request);
    });
});

server.listen(PORT, () => console.log(`Server running at port ${PORT}.`));

export { io };
