import React, { useState } from 'react';

interface LoginFormProps {
  handleLogin: (user: any) => void;
}

function Login({ handleLogin }: LoginFormProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('login endpoint här', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        alert('Fel användarnamn eller lösenord');
        return;
      }

      const user = await response.json();
      handleLogin(user);
    } catch (error) {
      console.error('Error vid inloggning:', error);
      alert('Ett fel inträffade vid inloggning');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
}

export default Login;