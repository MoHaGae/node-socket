const socket = io("https://79aab1eb1063.ngrok.io");

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

/**
 * Common Setting
 */
const nicknameBox = document.getElementById("nicknameBox");
const chatBox = document.getElementById("chatBox");
const LOG_S = "==========================================\n";
const LOG_E = "\n==========================================";
const HIDDEN_STR = "hidden"; 

const hiddenAll = () => {
    nicknameBox.setAttribute(HIDDEN_STR, "");
    chatBox.setAttribute(HIDDEN_STR, "");
};

/**
 * NickName Setting
 */
const initNickName = () => {
    console.log(`${LOG_S}[INIT NICKNAME PHASE]${LOG_E}`);
    hiddenAll();

    const nicknameForm = document.getElementById("nicknameForm");
    const nicknameInput = document.getElementById("nicknameInput");

    nicknameForm.addEventListener("submit", (event) => {
        console.log("==== nickname submit ====");
        event.preventDefault();

        if(nicknameInput.value.trim().length < 2) {
            alert("닉네임은 최소 두 글자 이상이어야 합니다 -_-;;;");
            return;
        }
            
        socket.emit("setNickname", { nickname: nicknameInput.value });

        socket.on("resultSetNickname", (data) => {
            if(data.result === FLAG.success) {
                socket.emit("requestJoinRoom");

                socket.on("resultJoinRoom", (data) => {
                    if(data.result === FLAG.success) {
                        socket.on("startGame", (_) => {

                        });
                    } else {
                        socket.on("joinRoom", () => {
                            socket.on("startGame", (_) => {

                            });
                        });
                    }
                });
            }
        });        
        // initChat();
    });

    nicknameBox.removeAttribute(HIDDEN_STR);
};

/**
 * Chat Setting
 */
const initChat = () => {
    console.log(`${LOG_S}[CHAT PHASE]${LOG_E}`);
    hiddenAll();

    const chatMsg = document.getElementById("chatMsg");
    const chatForm = document.getElementById("chatForm");
    const chatTextarea = document.getElementById("chatTextarea");

    const sendMsg = () => {
        const msg = chatTextarea.value;
        if(msg.trim().length <= 0) {
            return;
        }
        
        const msgParagraph = document.createElement("p");
        msgParagraph.innerHTML = `<b>나</b> ${chatTextarea.value}`;
        chatMsg.appendChild(msgParagraph);
        socket.emit("sendMsg", { msg });
        chatTextarea.value = "";
    }

    chatForm.addEventListener("submit", (event) => {
        console.log("==== chat submit ====");
        event.preventDefault();
        sendMsg();
    });
    
    chatTextarea.addEventListener("keypress", (event) => {
        // Chat 텍스트영역에서 Enter를 누를 경우
        if(event.keyCode === 13) {
            event.preventDefault();
            sendMsg();
        }
    });

    const renderChatParagraph =  (htmlTagStr) => {
        const msgParagraph = document.createElement("p");
        msgParagraph.innerHTML = `htmlTagStr`;
        chatMsg.appendChild(msgParagraph);
    };

    /**
     * socket io event 
     */
    socket.on("joinUser", (data) => {
        console.log(data);   
        renderChatParagraph(`<b>${data.nickname}</b>님이 접속했습니다.`);
    });

    socket.on("sendMsg", (data) => {
        console.log(data);   
        renderChatParagraph(`<b>${data.from}</b> ${data.msg}`);
    });

    chatBox.removeAttribute(HIDDEN_STR);
};

initNickName();