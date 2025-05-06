import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/App.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true); // Başlangıçta login ekranı görünsün

  const togglePage = () => {
    setIsLogin(!isLogin); // Login ile Register arasında geçiş yapacak
  };

  return (
    <div className="app-container">
      {isLogin ? (
        <LoginPage togglePage={togglePage} />
      ) : (
        <RegisterPage togglePage={togglePage} />
      )}
    </div>
  );
};

export default App;
