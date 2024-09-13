interface Player {
  username: string;
  currentPoints: number;
}

interface GameroomPlayersProps {
  players: Player[];
}

function GameroomPlayers({ players }: GameroomPlayersProps) {
  useEffect(() => {
    console.log("Players updated:", players);
  }, [players]);

  return (
    <div>
      <h3>Spelare i detta rummet:</h3>
      <ol>
        {players.map((player) => (
          <li key={player.username}>
            {player.username} - {player.currentPoints} poäng
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameroomPlayers;