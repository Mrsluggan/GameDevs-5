import { useState } from "react";

interface user {
  username: string;
  password: string;
}

interface Props {
  setPage: (page: string) => void;
}

function RegisterPage({ setPage }: Props) {
  const [newUser, setNewUser] = useState<user>({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("https://monkfish-app-xpltr.ondigitalocean.app/register-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newUser }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Användarnamnet är upptaget, prova ett annat namn!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Användare lades till: ", data);
        setErrorMessage("");
        setSuccessMessage(
          "Registrering lyckades! Du tas till inloggningssidan om 3 sekunder..."
        );
        setTimeout(() => {
          setPage("login");
        }, 3000);
      })
      .catch((error) => {
        console.error("Fel vid tillägning: ", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <form onSubmit={registerUser}>
      <h3>Registrera</h3>
      <label>
        Användarnamn
        <br />
        <input
          placeholder="Användarnamn"
          type="text"
          required
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
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
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        ></input>
      </label>
      <br />
      <br />
      {errorMessage && <p style={{ fontSize: "20px" }}>{errorMessage}</p>}
      {successMessage && <p style={{ fontSize: "20px" }}>{successMessage}</p>}
      <button className="button" type="submit">
        Registrera
      </button>
    </form>
  );
}

export default RegisterPage;
