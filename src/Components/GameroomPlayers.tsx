import React, { useEffect, useState } from "react";

interface Player {
  username: string;
  currentPoints: number;
}

interface GameroomPlayersProps {
  gameRoomID: string;
}

function GameroomPlayers({ gameRoomID }: GameroomPlayersProps) {
  const [players, setPlayers] = useState<any[]>([]);

  const loadPlayers = () => {
    fetch(`http://localhost:8080/api/gameroom/${gameRoomID}/players`)
      .then((res) => res.json())
      .then((data) => {
        const sortedPlayers = data.sort(
          (a: Player, b: Player) => b.currentPoints - a.currentPoints
        );
        setPlayers(sortedPlayers);
      })
      .catch((error) => {
        console.error("Fel vid hämtning av spelare:", error);
      });
  };

  useEffect(() => {
    loadPlayers();
  }, [gameRoomID]);

  return (
    <div>
      <h3>Players in this game:</h3>
      <ol>
        {players.map((player, index) => (
          <li key={index}>
            {player.username} - {player.currentPoints} points
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GameroomPlayers;
