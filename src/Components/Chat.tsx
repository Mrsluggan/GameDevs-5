import { useEffect, useState } from "react";
import { useStompClient, useSubscription } from "react-stomp-hooks";
interface Props {
  gameRoomID: string
}
export default function Chat({ gameRoomID }: Props) {
  const stompClient = useStompClient();
  const [output, setoutput] = useState<any>("");
  const [listOfMessages, setListOfMessages] = useState<any>([])


  useSubscription("/topic/welcome/" + gameRoomID, (message) => setoutput(message.body));

  const sendWelcome = () => {
    const username = localStorage.getItem("username")!;
    if (stompClient) {
      //Send Message
      stompClient.publish({
        destination: "/app/welcome/" + gameRoomID,
        body: username,
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
      {output}
    </div>
  );
}
