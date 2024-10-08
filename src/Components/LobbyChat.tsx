import { useEffect, useRef, useState } from "react";
import { IMessage, useStompClient, useSubscription } from "react-stomp-hooks";

interface Message {
  content: string;
  sender: string;
}

export default function LobbyChat() {
  const stompClient = useStompClient();
  const [listOfMessages, setListOfMessages] = useState<Message[]>([]);
  const chatBoxRef = useRef<HTMLUListElement>(null);

  useSubscription("/topic/lobby", (message: IMessage) => {
    try {
      const parsed: Message = JSON.parse(message.body);
      setListOfMessages((prevMessages) => [...prevMessages, parsed]);
    } catch (e) {
      console.error("Fel:", e);
      console.error("Invalid JSON message:", message.body);
    }
  });

  const sendMessage = (message: string) => {
    if (message.length === 0) {
      console.log("Message missing");
    } else {
      console.log("Sending message");
      if (stompClient) {
        stompClient.publish({
          destination: "/app/lobby",
          body: JSON.stringify({
            content: message,
            sender: localStorage.getItem("username") || "Unknown",
          }),
        });
      }
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [listOfMessages]);

  return (
    <div>
      <div>
        <h3 id="lobbyChatTitle">Lobbychatt</h3>
        <ul
          ref={chatBoxRef}
          style={{
            display: "flex",
            flexDirection: "column",
            listStyleType: "none",
            border: "1px solid white",
            overflowY: "scroll",
            height: "500px",
            padding: "10px",
          }}
        >
          {listOfMessages.map((message, index) => (
            <li
              key={index}
              style={{
                textAlign:
                  message.sender === localStorage.getItem("username")
                    ? "right"
                    : "left",
              }}
            >
              {message.sender}: {message.content}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <textarea
          id="lobbyMessageInput"
          style={{
            width: "80%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            resize: "none",
            height: "50px",
            backgroundColor: "white",
            color: "black",
          }}
          rows={3}
        />
        <button
          onClick={() => {
            const inputElement = document.getElementById(
              "lobbyMessageInput"
            ) as HTMLInputElement;
            sendMessage(inputElement.value);
            inputElement.value = "";
          }}
        >
          Skicka
        </button>
      </div>
    </div>
  );
}
