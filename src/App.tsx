import { useEffect, useState } from "react";
import backgroundMusic from "./backgroundMusic.mp3";
import "./App.css";
import { StompSessionProvider } from "react-stomp-hooks";
import Gameroom from "./Components/Gameroom";
import Menu from "./Components/Menu";
import About from "./Components/About";
import Start from "./Components/Start";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Leaderboard from "./Components/Leaderboard";
import AddWord from "./Components/AddWord";


const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [page, setPage] = useState<string>("");

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedState = localStorage.getItem("isLoggedIn");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    let pageUrl = page;

    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "start";
      }
    }

    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  useEffect(() => {
    const BackgroundAudio = new Audio(backgroundMusic);
    BackgroundAudio.loop = true;


    const playButton = document.getElementById("playButton");
    if (playButton) {
      playButton.addEventListener("click", () => {
        BackgroundAudio.play().catch((error) => {
          console.error("Error playing audio: ", error);
        });
      });
    }
  }, []);

  return (
    <>

 
      <StompSessionProvider url={`${API_URL}/ws-endpoint`}>


        <h1>Drawing Game</h1>
        <button id="playButton">Bakgrunds musik!</button>
        <Menu
          setPage={setPage}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
        />

        {{
          start: <Start />,
          login: <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />,
          register: <Register setPage={setPage} />,
          about: <About />,
          gameroom: isLoggedIn ? (
            <Gameroom />
          ) : (
            <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
          ),
          leaderboard: isLoggedIn ? (
            <Leaderboard />
          ) : (
            <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
          ),
          AddWord: isLoggedIn ? (
            <AddWord />
          ) : (
            <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />
          ),
        }[page] || <Start />}
      </StompSessionProvider>
    </>
  );
}

export default App;
