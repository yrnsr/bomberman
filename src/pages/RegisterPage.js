import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = ({ togglePage }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Burada register işlemi yapılacak
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Kayıt Ol</button>
        </form>
        <p>
          Zaten bir hesabınız var mı?{' '}
          <span className="auth-switch" onClick={togglePage}>
            Giriş Yap
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
