interface Player {
  username: string;
  currentPoints: number;
}

interface GameroomPlayersProps {
  players: Player[];
}

function GameroomPlayers({ players }: GameroomPlayersProps) {
  return (
    <div>
      <h3>Spelare i detta rummet:</h3>
      <ol>
        {players.map((player) => (
          <li key={player.username}>
            {player.username} - {player.currentPoints} poäng
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GameroomPlayers;
