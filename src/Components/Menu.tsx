interface Props {
      setPage: ((page: string) => void)
}


function Menu(props: Props) {
    return (
        <div>
        <button onClick={() => props.setPage("start")}>Start</button>
        <button onClick={() => props.setPage("login")}>Login</button>
        <button onClick={() => props.setPage("about")}>About</button>
        <button onClick={() => props.setPage("register")}>Register</button> 
        <button onClick={() => props.setPage("gameroom")}>Gameroom</button> 
        </div>
    );
}

export default Menu;