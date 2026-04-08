import React, { useEffect, useState } from 'react';
import type { Task } from '../../models/GroupTaskManager/task';
import * as taskService from '../../services/GroupTaskManager/taskService';
import TaskItem from '../../components/GroupTaskManager/TaskItem';
import TaskForm from '../../components/GroupTaskManager/TaskForm';
import UserDisplay from '../../components/GroupTaskManager/UserDisplay';
import styles from './groupTaskManager.module.css';

const USER_KEY = 'group_task_user';

const TaskList: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem(USER_KEY);
    setUser(u);
    setTasks(taskService.getTasks());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const handleAdd = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    taskService.addTask(newTask);
    setTasks(taskService.getTasks());
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    setEditing(task);
    setShowForm(true);
  };

  const handleUpdate = (task: Omit<Task, 'id'>) => {
    if (editing) {
      const updated = { ...editing, ...task };
      taskService.updateTask(updated);
      setTasks(taskService.getTasks());
      setEditing(null);
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    taskService.deleteTask(id);
    setTasks(taskService.getTasks());
  };

  if (!user) {
    // Nếu mất user, reload lại trang để về login
    return null;
  }

  return (
    <div className={styles.gtmContainer}>
      <UserDisplay username={user} />
      <button className={styles.gtmLogoutBtn} onClick={handleLogout}>Đăng xuất</button>
      <h2>Danh sách công việc</h2>
      <button className={styles.gtmAddBtn} onClick={() => { setShowForm(true); setEditing(null); }}>Thêm công việc</button>
      {showForm && (
        <TaskForm
          initial={editing || {}}
          onSubmit={editing ? handleUpdate : handleAdd}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      <table className={styles.gtmTable}>
        <thead>
          <tr>
            <th>Tên công việc</th>
            <th>Người được giao</th>
            <th>Mức độ ưu tiên</th>
            <th>Deadline</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
