import { useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";

interface Message {
  content: string;
  sender: string;
}

interface Props {
  gameRoomID: string;
  players: string[];
  randomWord: string;
  painter: string;
  isPainter: boolean;
  setIsPainter: (isPainter: boolean) => void;
  wonRound: () => void;
}
export default function Chat({
  gameRoomID,
  randomWord,
  isPainter,
  wonRound,
}: Props) {
  const stompClient = useStompClient();
  const [listOfMessages, setListOfMessages] = useState<Message[]>([]);
  const chatBoxRef = useRef<HTMLUListElement>(null);

  useSubscription("/topic/welcome/" + gameRoomID, (message) => {
    const parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages) => [...prevMessages, parsed]);
  });

  useSubscription("/topic/message/" + gameRoomID, (message) => {
    const parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages) => [...prevMessages, parsed]);
  });

  const sendWelcome = () => {
    const username = localStorage.getItem("username")!;
    if (stompClient) {
      stompClient.publish({
        destination: "/app/welcome/" + gameRoomID,
        body: JSON.stringify({
          username: username,
        }),
      });
    }
  };
  const checkGuess = (message: string, currentWord: string) => {
    if (message.toLowerCase() === currentWord.toLowerCase()) {
      wonRound();
    }
  };

  const sendMessage = (message: string) => {
    if (message.length === 0) {
      console.log("meddelande saknas");
    } else {
      checkGuess(message, randomWord);
      console.log("skickar meddelande");
      if (stompClient) {
        const sender = localStorage.getItem("username");
        stompClient.publish({
          destination: "/app/message/" + gameRoomID,
          body: JSON.stringify({
            content: message,
            sender: sender,
          }),
        });
      }
    }
  };

  const loadMessags = (gameRoomID: string) => {
    fetch("http://localhost:8080/api/gameroom/" + gameRoomID)
      .then((res) => res.json())
      .then((data) => {
        data.roomChat.listOfMessages.forEach((message: Message) => {
          setListOfMessages((prevMessages) => [...prevMessages, message]);
        });
      });
  };

  useEffect(() => {
    sendWelcome();
    loadMessags(gameRoomID);
  }, [gameRoomID]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [listOfMessages]);

  return (
    <div>
      <div>
        <ul
          id="chatBox"
          ref={chatBoxRef}
          style={{
            display: "flex",
            flexDirection: "column",
            listStyleType: "none",
            border: "1px solid white",
            overflowY: "scroll",
            height: "450px",
            padding: "10px",
          }}
        >
          {listOfMessages.map((message, index) => {
            if (message.sender === localStorage.getItem("username")) {
              return (
                <li key={index} style={{ textAlign: "right" }}>
                  {message.content}
                </li>
              );
            }
            return (
              <li key={index} style={{ textAlign: "left" }}>
                {message.sender}: {message.content}
              </li>
            );
          })}
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
        {!isPainter && (
          <div>
            <textarea
              id="messageInput"
              style={{
                width: "80%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                backgroundColor: "white",
                color: "black",

                resize: "none",
                height: "50px",
              }}
              rows={3}
            />

            {/* Vi måste hitta ett bättre sätt att göra dettta? liksom va fan är de här för knapp lol*/}

            <button
              onClick={() => {
                sendMessage(
                  (document.getElementById("messageInput") as HTMLInputElement)
                    .value
                );
                (
                  document.getElementById("messageInput") as HTMLInputElement
                ).value = "";
              }}
            >
              Skicka
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
