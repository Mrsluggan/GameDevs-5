import { useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
interface Props {
  gameRoomID: string;
  gameRandomWord: string;
  players: string[];
  assignRandomWordToPlayer: (gameRoomID: string, p0: any) => void;
  getRandomPlayer: () => string;
  clearGameRandomWord: (gameRoomID: string) => void;
}
export default function Chat({ gameRoomID, players, assignRandomWordToPlayer, getRandomPlayer, clearGameRandomWord}: Props) {
  const stompClient = useStompClient();
  const [output, setoutput] = useState<any>("");
  const [message, setMessage] = useState<any>("");
  const [randomWord, setRandomWord] = useState("");
  const [gameRandomWord, setGameRandomWord] = useState("");
  const [listOfMessages, setListOfMessages] = useState<any[]>([]);

  const chatBoxRef = useRef<HTMLUListElement>(null);

  useSubscription("/topic/welcome/" + gameRoomID, (message: any) => {
    let parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages: any[]) => [...prevMessages, parsed]);
  });

  useSubscription("/topic/message/" + gameRoomID, (message: any) => {
    let parsed = JSON.parse(message.body);
    console.log(parsed);
    setListOfMessages((prevMessages: string[]) => [...prevMessages, parsed]);
  });

  const fetchGameRandomWord = (gameRoomID: string) => {
  
    fetch("http://localhost:8080/api/gameroom/" + gameRoomID)
      .then(res => res.json())
      .then(data => {
        setRandomWord(data.randomWord);

      });
  }
  fetchGameRandomWord(gameRoomID)

  const setNewPainter = () => {
    fetch(`http://localhost:8080/api/gameroom/setpainter/${gameRoomID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(res => res.json())
    .then(data => {
      const newPainter = data.painter;
      if (stompClient) {
        stompClient.publish({
          destination: "/app/newPainter/" + gameRoomID,
          body: JSON.stringify({
            painter: newPainter,
          }),
        });
      }
    })
    .catch(error => {
      console.error("Error setting new painter:", error);
    });
  };


  const sendWelcome = () => {
    let username = localStorage.getItem("username")!;
    if (stompClient) {
      console.log(username);

  stompClient.publish({
        destination: "/app/welcome/" + gameRoomID,
        body: JSON.stringify({
          username: username,
        }),
      });
    } 
  }

  const sendMessage = (message: string) => {
    if (message.length === 0) {
      console.log("meddelande saknas");
    } else {
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
        console.log("Meddelande skickat", message);
        console.log("Random ord: ", randomWord);
        
        

        if (message.toLowerCase().includes(randomWord.toLowerCase())) {
          const congratsMessage = `Grattis ${sender} du gissade rätt!`;
          stompClient.publish({
            destination: "/app/message/" + gameRoomID,
            body: JSON.stringify({
              content: congratsMessage,
              sender: "Server",
            }),
          });
          setListOfMessages((prevMessages: any[]) => [
            ...prevMessages,
            { content: congratsMessage, sender: "Server" },

          ]);
          console.log("Ny painter ska utses");
          setNewPainter();
          assignRandomWordToPlayer(gameRoomID, getRandomPlayer());
          clearGameRandomWord(gameRoomID);
        }
      }
    }
  };



  const loadMessags = (gameRoomID: string) => {
    fetch("http://localhost:8080/api/gameroom/" + gameRoomID)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.roomChat.listOfMessages);
        data.roomChat.listOfMessages.forEach((message: any) => {
          setListOfMessages((prevMessages: any[]) => [...prevMessages, message]);
        })
      })
  }


  useEffect(() => {
    sendWelcome()
    loadMessags(gameRoomID)
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
          {listOfMessages.map((message: any, index: any) => {
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
        <textarea
          id="messageInput"
          style={{
            width: "80%", // Sätter bredd för att matcha meddelandena
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            backgroundColor: "white",
            color: "black",

            resize: "none", // Förhindrar användaren från att ändra storlek på textrutan
            height: "50px", // Höjden för textarea
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
    </div>
  );
}


