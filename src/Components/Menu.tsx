import Logout from "./Logout";

interface Props {
  setPage: (page: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

function Menu(props: Props) {
  return (
    <div>
      <button onClick={() => props.setPage("start")}>Start</button>
      <button onClick={() => props.setPage("about")}>Om spelet</button>
      {props.isLoggedIn && (
        <>
          <button onClick={() => props.setPage("gameroom")}>Spela</button>
          <button onClick={() => props.setPage("leaderboard")}>
            Topplista
          </button>
          <Logout setIsLoggedIn={props.setIsLoggedIn} setPage={props.setPage} />
        </>
      )}
      {!props.isLoggedIn && (
        <>
          <button onClick={() => props.setPage("login")}>Logga in</button>
          <button onClick={() => props.setPage("register")}>Registrera</button>
        </>
      )}
    </div>
  );
}

export default Menu;
