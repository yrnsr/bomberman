import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ togglePage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Burada login işlemi yapılacak
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Giriş Yap</button>
        </form>
        <p>
          Hesabınız yok mu?{' '}
          <span className="auth-switch" onClick={togglePage}>
            Kayıt Ol
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
