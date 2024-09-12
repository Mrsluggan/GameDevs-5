import { useEffect } from "react";

interface Player {
  username: string;
  currentPoints: number;
}

interface GameroomPlayersProps {
  players: Player[];
}

function GameroomPlayers({ players }: GameroomPlayersProps) {
  useEffect(() => {
    console.log(players + " nu uppdateras det");
    players.forEach((element) => {
      console.log(element);
    });
  }, [players]);

  return (
    <div>
      <h3>Spelare i detta rummet:</h3>
      <ol>
        {players.map((player, index) => (
          <li key={index}>
            {player.username} - {player.currentPoints} poäng
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GameroomPlayers;
