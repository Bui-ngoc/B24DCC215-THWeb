import React, { useState } from 'react';

const Login: React.FC<{ onLogin: (username: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  return (
    <form className="gtm-login-form" onSubmit={e => { e.preventDefault(); if (username) onLogin(username); }}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Tên người dùng" required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
};

export default Login;
