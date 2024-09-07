import { useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
interface Props {
  gameRoomID: string

}
export default function Chat({ gameRoomID }: Props) {

  const stompClient = useStompClient();
  const [output, setoutput] = useState<any>("");
  const [message, setMessage] = useState<any>("");


  const [listOfMessages, setListOfMessages] = useState<any[]>([]);

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

  const sendWelcome = () => {
    console.log("skickar hej");

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
    console.log("skickar meddelande");
    console.log(message);

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

  const loadMessags = () => {

    fetch("http://localhost:8080/api/gameroom/")
      .then(res => res.json())
      .then(data => {

      })

  }



  useEffect(() => {
    sendWelcome()
  }, []);

  return (
    <div >

      skicka meddelande <button onClick={sendWelcome}>skicka</button>

      <br />

      <ul id="chatBox" style={{ display: "flex", flexDirection: "column", listStyleType: "none", border: "1px solid white", overflowY: "scroll", height: "200px", padding: "10px", }}>

        {listOfMessages.map((message: any, index: any) => {
          if (message.sender === localStorage.getItem("username")) {
            return <li key={index} style={{ textAlign: "right" }}>{message.content}</li>;
          }
          return <li key={index} style={{ textAlign: "left" }}>{message.sender}: {message.content}</li>;
        })}

      </ul>
      <div style={{ display: "flex" }}>

        {/* Vi måste hitta ett bättre sätt att göra dettta? liksom va fan är de här för knapp lol*/}
        <input type="text" id="messageInput" /> <button onClick={() => { sendMessage((document.getElementById("messageInput") as HTMLInputElement).value); (document.getElementById("messageInput") as HTMLInputElement).value = ""; }}>Skicka</button>
      </div>
    </div>
  );
}
