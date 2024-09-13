import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  setPage: (page: string) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

interface user {
  username: string;
  password: string;
}

function Login({ setPage, setIsLoggedIn }: Props) {
  const [newLogin, setNewLogin] = useState<user>({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const loginUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`${API_URL}/login-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newLogin }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fel användarnamn eller lösenord, prova igen!");
        }
        return response.text();
      })
      .then((token) => {
        console.log("Mottagen JWT-token:", token);

        localStorage.setItem("username", newLogin.username);
        localStorage.setItem("token", token);

        setPage("start");
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <h3>Logga in</h3>
        <label>
          Användarnamn
          <br />
          <input
            placeholder="Användarnamn"
            type="text"
            required
            value={newLogin.username}
            onChange={(e) =>
              setNewLogin({ ...newLogin, username: e.target.value })
            }
          ></input>
        </label>
        <br />
        <br />
        <label>
          Lösenord
          <br />
          <input
            placeholder="Lösenord"
            type="password"
            required
            value={newLogin.password}
            onChange={(e) =>
              setNewLogin({ ...newLogin, password: e.target.value })
            }
          ></input>
        </label>
        <br />
        <br />
        {errorMessage && <p style={{ fontSize: "20px" }}>{errorMessage}</p>}
        <button className="button" type="submit">
          Logga in
        </button>
      </form>
    </div>
  );
}

export default Login;
