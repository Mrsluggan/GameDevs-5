import { useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
interface Props {
  gameRoomID: string
}
export default function Chat({ gameRoomID }: Props) {
  const stompClient = useStompClient();
  const [output, setoutput] = useState<any>("");
  const [listOfMessages, setListOfMessages] = useState<any>([])


  useSubscription("/topic/welcome/" + gameRoomID, (message: any) => {
    let data = JSON.parse(message.body);
    console.log(data.message);
    setoutput(data.message);
    listOfMessages.push(data.message);
    setListOfMessages(listOfMessages);

  });

  useSubscription("/topic/message/" + gameRoomID, (message: any) => {
    console.log(message.body);


  });

  const sendWelcome = () => {
    console.log("skickar hej");

    let username = localStorage.getItem("username")!;

    if (stompClient) {
      //Send Message
      stompClient.publish({
        destination: "/app/welcome/" + gameRoomID,
        body: JSON.stringify({ username: username }),
      });
    } else {
      //Handle error
    }
  }

  const sendMessage = (message: string) => {

    if (stompClient) {
      //Send Message
      stompClient.publish({
        destination: "/app/message/" + gameRoomID,
        body: JSON.stringify({ message: message }),
      });
    } else {
      //Handle error
    }
  }

  useEffect(() => {
    sendWelcome()
  }, []);

  return (
    <div >

      skicka meddelande <button onClick={sendWelcome}>skicka</button>

      <br />

      <ul id="chatBox" style={{ listStyleType: "none", border: "1px solid white", textAlign: "left" }}>

        {listOfMessages.map((message: any, index: any) => (
          <li key={index}>{message}</li>
        ))}


      </ul>
      <div style={{ display: "flex" }}>
        <form  >
        <input type="text" style={{ width: "100%", height: "30px" }} name="messageInput" /> <button type="submit">Skicka</button>
        </form>
      </div>
    </div>
  );
}
