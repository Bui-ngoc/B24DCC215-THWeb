import React from 'react';
import { Task } from '../../models/GroupTaskManager/task';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  return (
    <tr>
      <td>{task.name}</td>
      <td>{task.assignee}</td>
      <td>{task.priority}</td>
      <td>{task.deadline}</td>
      <td>{task.status}</td>
      <td>
        <button onClick={() => onEdit(task)}>Sửa</button>
        <button onClick={() => onDelete(task.id)}>Xóa</button>
      </td>
    </tr>
  );
};

export default TaskItem;
