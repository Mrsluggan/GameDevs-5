import { useEffect, useState } from "react";
import "./App.css";

import Gameroom from "./Components/Gameroom";
import Menu from "./Components/Menu";
import About from "./Components/About";
import Start from "./Components/Start";
import Register from "./Components/Register";
import Login from "./Components/Login";

function App() {
  
  const [page, setPage] = useState<string>("");

  useEffect(() => {

    let pageUrl = page;

    if(!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl)
      } else {
        pageUrl = "start"
      }
    } 

    window.history.pushState(
      null,
      "",
      "?page=" + pageUrl
    )

  }, [page]);

  const handleRegistration = () => {
    setPage("start");
  };

  const handleLogin = () => {
    setPage("start");
  }

  return (
    <>
      <h1>Drawing Game</h1>
      <Menu setPage={setPage} />

      {
        {
          "start": <Start />,
          "login": <Login handleLogin={handleLogin} />,
          "register": <Register handleRegistration={handleRegistration} />,
          "about": <About />,
          "gameroom": <Gameroom />
          
        } [page] || <Start />
      }

    </>
  )
}

export default App;
