import { useEffect, useState } from "react";
import Canvas from "./Canvas";
import Chat from "./Chat";
import { useStompClient, useSubscription } from "react-stomp-hooks";
interface gameroom {
  gameRoomName: any
}


function Gameroom() {
  const stompClient = useStompClient();
  const [gamerooms, setGamerooms] = useState<any[]>([]);
  const [isJoined, setIsJoined] = useState(false);

  useSubscription("/topic/test", (message) => console.log(message.body));

  const sendMessage = () => {
    if (stompClient) {
      //Send Message
      stompClient.publish({
        destination: "/app/echo",
        body: "Echo 123",
      });
    } else {
      //Handle error
    }
  };



  const loadGameRooms = () => {
    fetch("http://localhost:8080/api/gameroom/")
      .then(res => res.json())
      .then(data => {
        setGamerooms(data);
        console.log(data);
      })
  }

  const createGame = () => {
    console.log("hej!");

    let gameroomName = prompt("Enter gameroom name");
    fetch("http://localhost:8080/api/gameroom/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameRoomName: gameroomName
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        loadGameRooms();
      })
  }


  const joinGame = () => {
    console.log(">:D");
    setIsJoined(true);



  }

  useEffect(() => {
    loadGameRooms();
  }, [])

  return (
    <>
      {/* kollar om personen tillhög en grupp, visar antigen gameroom div eller canvas */}
      {!isJoined ?
        <div id="GameRoomDiv">
          <div>
            <h2>Guess what this is?</h2>
          </div>
          create new game: <button onClick={createGame}>Create new game room</button>
          <div style={{ textAlign: "left" }}>
            <ul style={{ listStyle: "none" }}>
              {gamerooms.map((gameroom) => (
                <li key={gameroom.id} style={{}}>
                  <div id="container" style={{ margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3>{gameroom.gameRoomName}</h3>
                      <p>Room owner: <strong>{gameroom.roomOwner}</strong></p>
                      current players: {gameroom.listOfPlayers.length}

                    </div>
                    <button onClick={joinGame}>Join game</button>
                  </div>
                  <hr />

                </li>

              ))}
            </ul>
          </div>
        </div>
        :
        /* här är canvas */
        <div>

          SPELET SKA VARA HÄR
          <button onClick={sendMessage}>Send Message</button>

        </div>}

    </>
  );
}

export default Gameroom;