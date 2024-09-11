import React, { useEffect, useState } from "react";

interface Player {
  username: string;
  currentPoints: number;
}

interface GameroomPlayersProps {
  gameRoomID: string;
  players: any[];
}

function GameroomPlayers({ gameRoomID, players }: GameroomPlayersProps) {


  useEffect(() => {
    console.log(players + " nu uppdateras det");
    players.forEach((element) =>{
      console.log(element);
      
    })
  }, [players]);

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
