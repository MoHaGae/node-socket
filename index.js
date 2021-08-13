const express = require("express");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const logger = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();
const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

const server = app.listen(4000, () => {
	console.log(`✅ server listen http://localhost:4000`);
});

const io = socketIo(server);

/* 클라이언트 리스트 */
const clientList = [];

/* 대기열 큐 : 먼저 온놈이 먼저 들어간다 이것이 세상의 이치 */
const waitingQueue = []; 

/* 게임 진행에 필요한 상수 */
const READY_STATUS = 'ready'; // 게임방 대기 상태
const STARTING_STATUS = 'starting'; // 게임중인 상태
const FLAG  = {
    success: "success",
    fail: "fail",
    valid: "vailld",
    invalid: "invalid",
    full: "full"
}
const JOIN_CLIENT_LIMIT = 5; // 최대 게임 방 입장 인원수

/* 게임 방에 대한 정보 */
const gameRoom = {
  status: READY_STATUS,
  joinClientList: []
}

io.on("connection", (socket) => {
    console.log(`✅ Socket Connect`);
    clientMap[socket.id] = socket;

    /**
     * Nickname Setting
     */
    socket.on("setNickname", (data) => {
        socket.nickname = data.nickname;
        socket.emit("resultSetNickname", { result: FLAG.success });
        // socket.broadcast.emit("joinUser", { nickname: data.nickname});
    });

    /**
     * Game Setting
     */
    socket.on("requestJoinRoom", (_) => {
        if(gameRoom.status === READY_STATUS && joinClientList.length < JOIN_CLIENT_LIMIT) {
            // 방에 입장 가능한 케이스
            gameRoom.joinClientList.push(socket);
            const gameClientList = [];
            gameRoom.joinClientList.forEach(element => {
                const client = {};
                client.socketId = element.id; // TODO 추후 검증
                client.nickname = element.nickname;
                client.isMe = element.id === socket.id? true: false; 
            })

            socket.emit("resultJoinRoom", { result: FLAG.success});

            /* 게임을 시작할지 결정 */
            if(gameRoom.joinClientList.length >= JOIN_CLIENT_LIMIT) {
                // GAME START
                gameRoom.joinClientList.forEach(client => {
                    client.emit("startGame");
                });
            }
        } else {
            waitingQueue.push(socket);
            socket.emit("resultJoinRoom", { result: FLAG.full});
        }
    });

    // /**
    //  * Chat Setting
    //  */
    // socket.on("sendMsg", (data) => {
    //     /* send msg broadcast */
    //     socket.broadcast.emit("sendMsg", { msg: data.msg, from: socket.nickname});
    // });

    /**
     * Common Setting
     */
    socket.on("close", () => {
        delete clientMap[socket.id];

        /* send msg broadcast */
        socket.broadcast.emit("leaveUser", { from: socket.nickname});
    });

});
