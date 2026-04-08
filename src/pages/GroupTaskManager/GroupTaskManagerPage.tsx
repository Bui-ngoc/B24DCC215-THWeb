import React, { useState, useEffect } from 'react';
import Login from './login';
import TaskList from './taskList';
import styles from './groupTaskManager.module.css';

const USER_KEY = 'group_task_user';

const GroupTaskManagerPage: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    setUser(localStorage.getItem(USER_KEY));
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem(USER_KEY, username);
    setUser(username);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }
  return <TaskList />;
};

export default GroupTaskManagerPage;
