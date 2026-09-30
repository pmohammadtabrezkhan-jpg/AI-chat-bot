// =========================
// CHAT DATA
// =========================

let chats = JSON.parse(localStorage.getItem("chats")) || [];

let activeChatId =
    localStorage.getItem("activeChatId");


// =========================
// PAGE LOAD
// =========================

window.addEventListener("load", function () {

    if (chats.length === 0) {

        createNewChat(false);

    } else {

        if (
            !activeChatId ||
            !chats.find(chat => chat.id === activeChatId)
        ) {

            activeChatId = chats[0].id;

            localStorage.setItem(
                "activeChatId",
                activeChatId
            );
        }

        loadActiveChat();
    }

    loadHistoryList();

});


// =========================
// CREATE NEW CHAT
// =========================

async function newChat() {

    createNewChat(true);

}


function createNewChat(save = true) {

    const newChat = {

        id: Date.now().toString(),

        title: "New Chat",

        messages: []

    };


    chats.unshift(newChat);

    activeChatId =
        newChat.id;


    localStorage.setItem(
        "chats",
        JSON.stringify(chats)
    );

    localStorage.setItem(
        "activeChatId",
        activeChatId
    );


    const chatBox =
        document.getElementById("chatBox");


    chatBox.innerHTML = `
        <div class="message bot-message">
            Hello! 👋 I'm your AI Assistant. How can I help you?
        </div>
    `;


    fetch("/clear", {
        method: "POST"
    }).catch(error => {

        console.error(
            "Clear error:",
            error
        );

    });


    loadHistoryList();

}


// =========================
// GET ACTIVE CHAT
// =========================

function getActiveChat() {

    return chats.find(
        chat => chat.id === activeChatId
    );

}


// =========================
// SAVE CHATS
// =========================

function saveChats() {

    localStorage.setItem(
        "chats",
        JSON.stringify(chats)
    );

}


// =========================
// SEND MESSAGE
// =========================

async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const chatBox =
        document.getElementById("chatBox");


    const message =
        input.value.trim();


    if (!message) {

        return;

    }


    const chat =
        getActiveChat();


    if (!chat) {

        return;

    }


    // =========================
    // USER MESSAGE
    // =========================

    const userMessage =
        document.createElement("div");


    userMessage.className =
        "message user-message";


    userMessage.textContent =
        message;


    chatBox.appendChild(
        userMessage
    );


    chat.messages.push({

        role: "user",

        content: message

    });


    // =========================
    // CREATE CHAT TITLE
    // =========================

    if (chat.title === "New Chat") {

        chat.title =
            message.length > 30
                ? message.substring(0, 30) + "..."
                : message;

    }


    saveChats();

    loadHistoryList();


    input.value = "";


    // =========================
    // THINKING ANIMATION
    // =========================

    const thinking =
        document.createElement("div");


    thinking.className =
        "message bot-message";


    thinking.innerHTML = `
        <div class="thinking">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;


    chatBox.appendChild(
        thinking
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    // =========================
    // SEND TO FLASK
    // =========================

    try {

        const response =
            await fetch("/chat", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    message: message

                })

            });


        const data =
            await response.json();


        console.log(
            "SERVER DATA:",
            data
        );


        thinking.remove();


        // =========================
        // AI RESPONSE
        // =========================

        const botMessage =
            document.createElement("div");


        botMessage.className =
            "message bot-message";


        if (
            data &&
            data.response
        ) {

            // Render Markdown

            botMessage.innerHTML =
                marked.parse(
                    data.response
                );


            // Add Copy buttons

            addCopyButtons(
                botMessage
            );


            // Save AI response

            chat.messages.push({

                role: "assistant",

                content: data.response

            });


            saveChats();

        }


        else if (
            data &&
            data.error
        ) {

            botMessage.textContent =
                "⚠️ AI service is temporarily unavailable.";

        }


        else {

            botMessage.textContent =
                "⚠️ No response received from AI.";

        }


        chatBox.appendChild(
            botMessage
        );

    }


    catch (error) {

        thinking.remove();


        const botMessage =
            document.createElement("div");


        botMessage.className =
            "message bot-message";


        botMessage.textContent =
            "Connection error. Please try again.";


        chatBox.appendChild(
            botMessage
        );


        console.error(
            "ERROR:",
            error
        );

    }


    chatBox.scrollTop =
        chatBox.scrollHeight;

}


// =========================
// LOAD ACTIVE CHAT
// =========================

async function loadActiveChat() {

    const chat =
        getActiveChat();


    if (!chat) {

        return;

    }


    const chatBox =
        document.getElementById("chatBox");


    chatBox.innerHTML = "";


    // =========================
    // EMPTY CHAT
    // =========================

    if (chat.messages.length === 0) {

        chatBox.innerHTML = `
            <div class="message bot-message">
                Hello! 👋 I'm your AI Assistant. How can I help you?
            </div>
        `;

    }


    // =========================
    // LOAD SAVED MESSAGES
    // =========================

    chat.messages.forEach(
        function (msg) {

            const message =
                document.createElement("div");


            // =========================
            // USER MESSAGE
            // =========================

            if (
                msg.role === "user"
            ) {

                message.className =
                    "message user-message";


                message.textContent =
                    msg.content;

            }


            // =========================
            // AI MESSAGE
            // =========================

            else {

                message.className =
                    "message bot-message";


                // Render Markdown

                message.innerHTML =
                    marked.parse(
                        msg.content
                    );


                // Add Copy buttons

                addCopyButtons(
                    message
                );

            }


            chatBox.appendChild(
                message
            );

        }
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    // =========================
    // LOAD CONVERSATION
    // INTO FLASK
    // =========================

    try {

        await fetch(
            "/load_chat",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    messages:
                        chat.messages

                })

            }
        );

    }


    catch (error) {

        console.error(
            "Load chat error:",
            error
        );

    }

}


// =========================
// CHAT HISTORY SIDEBAR
// =========================

function loadHistoryList() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {

        return;

    }


    historyList.innerHTML = "";


    if (chats.length === 0) {

        historyList.innerHTML = `
            <div style="padding:10px;color:#aaa;">
                No chat history
            </div>
        `;

        return;

    }


    chats.forEach(
        function (chat) {

            const row =
                document.createElement(
                    "div"
                );


            row.style.display =
                "flex";


            row.style.alignItems =
                "center";


            row.style.gap =
                "5px";


            row.style.marginBottom =
                "7px";


            // =========================
            // CHAT TITLE
            // =========================

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            item.style.flex =
                "1";


            item.style.marginBottom =
                "0";


            item.textContent =
                "💬 " + chat.title;


            // =========================
            // ACTIVE CHAT
            // =========================

            if (
                chat.id === activeChatId
            ) {

                item.style.background =
                    "#444";

            }


            // =========================
            // OPEN CHAT
            // =========================

            item.onclick =
                function () {

                    activeChatId =
                        chat.id;


                    localStorage.setItem(
                        "activeChatId",
                        activeChatId
                    );


                    loadActiveChat();

                    loadHistoryList();

                };


            // =========================
            // DELETE BUTTON
            // =========================

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "Delete chat";


            deleteButton.style.border =
                "none";


            deleteButton.style.background =
                "#2d2d2d";


            deleteButton.style.color =
                "white";


            deleteButton.style.cursor =
                "pointer";


            deleteButton.style.padding =
                "8px";


            deleteButton.style.borderRadius =
                "6px";


            deleteButton.onclick =
                function (event) {

                    event.stopPropagation();

                    deleteChat(
                        chat.id
                    );

                };


            row.appendChild(
                item
            );


            row.appendChild(
                deleteButton
            );


            historyList.appendChild(
                row
            );

        }
    );

}


// =========================
// DELETE CHAT
// =========================

async function deleteChat(
    chatId
) {

    const chatIndex =
        chats.findIndex(
            chat => chat.id === chatId
        );


    if (chatIndex === -1) {

        return;

    }


    const deletedChat =
        chats[chatIndex];


    const confirmed =
        confirm(
            `Delete "${deletedChat.title}"?`
        );


    if (!confirmed) {

        return;

    }


    chats.splice(
        chatIndex,
        1
    );


    // =========================
    // IF ACTIVE CHAT DELETED
    // =========================

    if (
        chatId === activeChatId
    ) {

        if (chats.length > 0) {

            activeChatId =
                chats[0].id;

        }


        else {

            const newChat = {

                id:
                    Date.now().toString(),

                title:
                    "New Chat",

                messages:
                    []

            };


            chats.push(
                newChat
            );


            activeChatId =
                newChat.id;

        }


        localStorage.setItem(
            "activeChatId",
            activeChatId
        );


        await fetch(
            "/clear",
            {
                method: "POST"
            }
        );


        loadActiveChat();

    }


    saveChats();

    loadHistoryList();

}


// =========================
// CLEAR CURRENT CHAT
// =========================

async function clearChat() {

    const chat =
        getActiveChat();


    if (!chat) {

        return;

    }


    chat.messages = [];

    chat.title =
        "New Chat";


    saveChats();


    try {

        await fetch(
            "/clear",
            {
                method: "POST"
            }
        );

    }


    catch (error) {

        console.error(
            "Clear chat error:",
            error
        );

    }


    const chatBox =
        document.getElementById(
            "chatBox"
        );


    chatBox.innerHTML = `
        <div class="message bot-message">
            Hello! 👋 I'm your AI Assistant. How can I help you?
        </div>
    `;


    loadHistoryList();

}


// =========================
// OPEN SIDEBAR
// =========================

function openSidebar() {

    document.getElementById(
        "sidebar"
    ).style.display =
        "flex";

}


// =========================
// CLOSE SIDEBAR
// =========================

function closeSidebar() {

    document.getElementById(
        "sidebar"
    ).style.display =
        "none";

}


// =========================
// COPY CODE BUTTON
// =========================

function addCopyButtons(
    container
) {

    const codeBlocks =
        container.querySelectorAll(
            "pre"
        );


    codeBlocks.forEach(
        function (pre) {

            // Prevent duplicate buttons

            if (
                pre.querySelector(
                    ".copy-button"
                )
            ) {

                return;

            }


            pre.style.position =
                "relative";


            // =========================
            // CREATE COPY BUTTON
            // =========================

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "copy-button";


            button.textContent =
                "📋 Copy";


            // =========================
            // BUTTON STYLE
            // =========================

            button.style.position =
                "absolute";

            button.style.top =
                "8px";

            button.style.right =
                "8px";

            button.style.padding =
                "5px 9px";

            button.style.border =
                "1px solid #555";

            button.style.borderRadius =
                "6px";

            button.style.background =
                "#222";

            button.style.color =
                "white";

            button.style.cursor =
                "pointer";


            // =========================
            // COPY ACTION
            // =========================

            button.onclick =
                async function () {

                    const code =
                        pre.querySelector(
                            "code"
                        );


                    if (!code) {

                        return;

                    }


                    try {

                        await navigator
                            .clipboard
                            .writeText(
                                code.innerText
                            );


                        button.textContent =
                            "✅ Copied!";


                        setTimeout(
                            function () {

                                button.textContent =
                                    "📋 Copy";

                            },
                            1500
                        );

                    }


                    catch (error) {

                        console.error(
                            "Copy failed:",
                            error
                        );


                        button.textContent =
                            "❌ Failed";

                    }

                };


            pre.appendChild(
                button
            );

        }
    );

}


// =========================
// ENTER KEY
// =========================

document.getElementById(
    "userInput"
).addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);
