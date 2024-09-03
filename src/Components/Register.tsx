import { useState } from 'react';

interface RegisterProps {
  handleRegistration: () => void;
}

function Register({ handleRegistration }: RegisterProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Användarnamn och lösenord får inte vara tomma");
      return;
    }

    if (username.includes(" ") || password.includes(" ")) {
      alert("Användarnamn och lösenord får inte innehålla mellanslag");
      return;
    }

    try {
      const response = await fetch('registrera endpoint här', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const message = await response.text();

      alert(message);
      
      if (response.ok && message.includes("Registrering lyckades")) {
        handleRegistration();
      }
    } catch (error) {
      console.error('Error vid registrering:', error);
      alert("Ett fel inträffade vid registreringen");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Registrera</button>
      </form>
    </div>
  );
}

export default Register;