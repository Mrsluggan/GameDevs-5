import { useEffect, useRef, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
interface Props {
  gameRoomID: string

}
export default function Chat({ gameRoomID }: Props) {

  const stompClient = useStompClient();
  const [output, setoutput] = useState<any>("");
  const [message, setMessage] = useState<any>("");
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

  const joinGameRoom = () => {
    fetch("http://localhost:8080/api/gameroom/join" + gameRoomID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username")
      }),
    })
      .then(res => res.json())
      .then(data => {

      })
  }
  const leaveGameRoom = () => {
    fetch("http://localhost:8080/api/gameroom/leave" + gameRoomID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomOwner: localStorage.getItem("username")
      }),
    })
      .then(res => res.json())
      .then(data => {

      })
  }

  const sendWelcome = () => {



    let username = localStorage.getItem("username")!;
    if (stompClient) {
      console.log(username);

      //Send Message
      stompClient.publish({
        destination: "/app/welcome/" + gameRoomID,
        body: JSON.stringify({
          username: username
        }),
      });
    } else {
      //Handle error
    }
  }

  const sendMessage = (message: string) => {
    if (message.length == 0) {
      console.log("meddelande saknas");

    } else {
      console.log("skickar meddelande");
      if (stompClient) {
        //Send Message
        stompClient.publish({
          destination: "/app/message/" + gameRoomID,
          body: JSON.stringify({
            content: message,
            sender: localStorage.getItem("username")
          }),
        });
      } else {
        //Handle error
      }
    }
  }

  const loadMessags = () => {

    fetch("http://localhost:8080/api/gameroom/")
      .then(res => res.json())
      .then(data => {

      })

  }



  useEffect(() => {
    sendWelcome()
  }, []);


  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [listOfMessages]);




  return (
    <div >

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
            height: "200px",
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





      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <textarea id="messageInput" style={{
          width: "80%",  // Sätter bredd för att matcha meddelandena
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "10px",

          resize: "none",  // Förhindrar användaren från att ändra storlek på textrutan
          height: "50px",  // Höjden för textarea
        }} rows={3} />


        {/* Vi måste hitta ett bättre sätt att göra dettta? liksom va fan är de här för knapp lol*/}
        <button onClick={() => { sendMessage((document.getElementById("messageInput") as HTMLInputElement).value); (document.getElementById("messageInput") as HTMLInputElement).value = ""; }}>Skicka</button>
      </div>
    </div>
  );
}
