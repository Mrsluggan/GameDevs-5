import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AddWord() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const addWord = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const input = target.elements.namedItem("word") as HTMLInputElement;
    const word = input.value;

    console.log("Lägger till ord: " + word);

    fetch(`${API_URL}/createWord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Ordet lades till: ", data);
        if (errorMessage) {
          setErrorMessage("Ordet lades till!");
        }
        input.value = "";
      })

      .catch((error) => {
        console.error("Fel vid tillägg av ord: ", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <h2>Lägg till nytt ord!</h2>
      <h3>
        Tack för att ni hjälper till att göra spelet bättre genom att utöka
        ordförrådet!
      </h3>
      <form onSubmit={addWord}>
        <input
          type="text"
          name="word"
          placeholder="nytt ord"
          style={{ height: "30px", width: "250px" }}
        />
        <button type="submit">Lägg till</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default AddWord;
