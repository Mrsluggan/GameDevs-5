
interface GameroomPlayersProps {
  gameRoomID: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  players: any[];
}

const GameroomPlayers = ({ players }: GameroomPlayersProps) => {
  return (
    <div>
      <h3>Players in the game room</h3>
      <ul>
        {players.map((player) => (
          <li key={player.username}>
            <span>{player.username}</span> - <strong>{player.currentPoints} points</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameroomPlayers;
