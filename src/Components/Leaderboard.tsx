import { useEffect, useState } from "react";

interface User {
  userId: string;
  username: string;
  totalWins: number;
}

function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const fetchTopUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/get-top-users"
      );
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Fel vid hämtning", error);
    }
  };

  return (
    <div>
      <h3>Användarna med flest vinster:</h3>
      <ol>
        {users.map((user) => (
          <li key={user.userId}>
            <strong>{user.username}</strong>: {user.totalWins}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
