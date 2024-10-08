import { useEffect, useState } from "react";
import Chat from "./Chat";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import Canvas from "./Canvas";
import GameroomPlayers from "./GameroomPlayers";
import LobbyChat from "./LobbyChat";
import "./GameStyle.css";

const API_URL = import.meta.env.VITE_API_URL;

interface Player {
  username: string;
  currentPoints: number;
}
interface GameRoom {
  id: string;
  gameRoomName: string;
  roomOwner: string;
  listOfPlayers: Player[];
  painter: string;
  randomWord: string;
  players: Player[];
}

function Gameroom() {
  const stompClient = useStompClient();
  const [gamerooms, setGamerooms] = useState<GameRoom[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [gameRoomID, setGameRoomID] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomOwner, setRoomOwner] = useState<boolean>(false);
  const [painter, setPainter] = useState<string>("");
  const [isPainter, setIsPainter] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<string>("");

  useSubscription(`/topic/updategame/${gameRoomID}`, (message) => {
    const parsed = JSON.parse(message.body);
    console.log("Received painter from WebSocket:", parsed.painter);
    loadPlayers();
    setPlayers(parsed.listOfPlayers);
    console.log(players);
    setPainter(parsed.painter);
    setCurrentWord(parsed.randomWord);
  });

  useSubscription("/topic/gamerooms", (message) => {
    const newGameRoom = JSON.parse(message.body);
    setGamerooms((prevGamerooms) => [...prevGamerooms, newGameRoom]);
  });

  useSubscription(`/topic/updategameroom/${gameRoomID}`, (message) => {
    const updatedGameRoom = JSON.parse(message.body);
    loadPlayers();
    setGamerooms((prevGamerooms) =>
      prevGamerooms.map((room) =>
        room.id === updatedGameRoom.id ? updatedGameRoom : room
      )
    );
  });


  useSubscription("/topic/gamerooms/delete", (message) => {
    const deletedGameRoomID = message.body;
    setGamerooms((prevGamerooms) =>
      prevGamerooms.filter((room) => room.id !== deletedGameRoomID)
    );
  });

  const loadPlayers = async () => {
    fetch(`${API_URL}/api/gameroom/` + gameRoomID + "/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
      });
  };

  const loadGameRooms = async () => {
    fetch(`${API_URL}/api/gameroom/`)
      .then((res) => res.json())
      .then((data) => {
        setGamerooms(data);
      });
  };

  const checkPlayers = async () => {
    fetch(
      `${API_URL}/api/gameroom/checkplayer/` + localStorage.getItem("username")
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Kunde inte hitta spelare");
        }
      })
      .then((data) => {
        if (localStorage.getItem("username") === data.roomOwner) {
          setRoomOwner(data.roomOwner);
        }

        setGameRoomID(data.id);
        setIsJoined(true);
        joinGame(data.id);
      });
  };

  const createGame = async () => {
    const gameroomName = prompt("Enter gameroom name");
    if (gameroomName == null) {
      return;
    }
    if (!gameroomName || gameroomName.trim().length === 0) {
      alert("Du måste ange ett namn på rummet");
      return;
    }
    fetch(`${API_URL}/api/gameroom/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameRoomName: gameroomName,
        roomOwner: localStorage.getItem("username"),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        loadGameRooms();
      });
  };

  const deleteGameRoom = async (gameRoomID: string, roomOwner: string) => {
    const confirmed = window.confirm("Vill du verkligen radera ditt rum?");
    if (!confirmed) {
      return;
    }
    fetch(`${API_URL}/api/gameroom/delete/${gameRoomID}/${roomOwner}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        console.log("Spel raderat");
      } else {
        console.error("Fel vid radering av spel");
      }
      loadGameRooms();
    });
  };

  const joinGame = async (gameRoomID: string) => {
    setIsJoined(true);
    setGameRoomID(gameRoomID);

    fetch(`${API_URL}/api/gameroom/join/` + gameRoomID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    }).then(() => {
      fetch(`${API_URL}/api/gameroom/` + gameRoomID)
        .then((res) => res.json())
        .then((data) => {
          setPlayers(data.listOfPlayers);
          setCurrentWord(data.randomWord);
          setPainter(data.painter);
        });
    });
    if (stompClient) {
      stompClient.publish({
        destination: "/app/updategame/" + gameRoomID,
      });
    }
  };

  const leaveGameRoom = async () => {
    const confirmed = window.confirm(
      "Om du lämnar nollställs din poäng, vill du lämna ändå?"
    );
    if (!confirmed) {
      return;
    }
    const username = localStorage.getItem("username");

    fetch(`${API_URL}/reset-points/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User points reset:", data);
      })
      .catch((error) => {
        console.error("Error resetting points:", error);
      });

    fetch(`${API_URL}/api/gameroom/leave/` + gameRoomID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });

    if (stompClient) {
      stompClient.publish({
        destination: "/app/updategame/" + gameRoomID,
      });
    }

    setIsJoined(false);
    loadGameRooms();
  };

  const startGame = async () => {
    await fetch(`${API_URL}/api/gameroom/setpainter/` + gameRoomID);
    if (stompClient) {
      stompClient.publish({
        destination: "/app/updategame/" + gameRoomID,
      });
    }
  };

  const wonRound = () => {
    alert("DU vann! ");
    startGame();
  };

  useEffect(() => {
    if (painter === localStorage.getItem("username")) {
      setIsPainter(true);
    } else {
      setIsPainter(false);
    }
  }, [painter]);



  useEffect(() => {
    loadGameRooms();
    checkPlayers();
  }, []);
  useEffect(() => {
    checkPlayers();
  }, [gameRoomID]);



  return (
    <>
      {!isJoined ? (
        <div id="GameRoomDiv">
          <div>
            <h2>Gissa ritningen!</h2>
          </div>
          <button onClick={createGame}>Skapa spelrum</button>
          <div style={{ textAlign: "left" }}>
            <ul style={{ listStyle: "none" }}>
              {gamerooms.map((gameroom) => (
                <li key={gameroom.id} style={{}}>
                  <div
                    id="container"
                    style={{
                      margin: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3>{gameroom.gameRoomName}</h3>
                      <p>
                        Ägare: <strong>{gameroom.roomOwner}</strong>
                      </p>
                      Deltagare: {gameroom.listOfPlayers.length}
                    </div>
                    <div>
                      <button onClick={() => joinGame(gameroom.id)}>
                        Gå med
                      </button>
                      {localStorage.getItem("username") ===
                        gameroom.roomOwner && (
                          <button
                            onClick={() =>
                              deleteGameRoom(gameroom.id, gameroom.roomOwner)
                            }
                          >
                            {" "}
                            Ta bort rum
                          </button>
                        )}
                    </div>
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
          <div id="lobbyChat">
            <LobbyChat />
          </div>
        </div>
      ) : (
        <div style={{ padding: "2%" }}>
          <div style={{}}>
            <button onClick={leaveGameRoom}>Lämna spelrum</button>
            {roomOwner && <button onClick={startGame}>Starta spelet</button>}
          </div>

          {isPainter ? (
            <div>
              <h2>Det är du som är ritaren!</h2>
              <h3>Du ska rita ordet: {currentWord}</h3>
            </div>
          ) : (
            <h2>Den som ritar är: {painter}</h2>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <GameroomPlayers players={players} />
            <Canvas gameRoomID={gameRoomID} isPainter={isPainter} />
            <Chat
              gameRoomID={gameRoomID}
              players={players}
              randomWord={currentWord}
              painter={painter}
              isPainter={isPainter}
              setIsPainter={setIsPainter}
              wonRound={wonRound}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Gameroom;
