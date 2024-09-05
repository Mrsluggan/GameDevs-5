function Logout({
  setIsLoggedIn,
  setPage,
}: {
  setIsLoggedIn: (loggedIn: boolean) => void;
  setPage: (page: string) => void;
}) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setPage("login");
  };

  return (
    <button className="button" onClick={handleLogout}>
      Logga ut
    </button>
  );
}

export default Logout;
