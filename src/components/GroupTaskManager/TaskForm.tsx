import React, { useState } from 'react';
import { Task, Priority, Status } from '../../models/GroupTaskManager/task';

interface TaskFormProps {
  initial?: Partial<Task>;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initial = {}, onSubmit, onCancel }) => {
  const [name, setName] = useState(initial.name || '');
  const [assignee, setAssignee] = useState(initial.assignee || '');
  const [priority, setPriority] = useState<Priority>(initial.priority || 'Thấp');
  const [deadline, setDeadline] = useState(initial.deadline || '');
  const [status, setStatus] = useState<Status>(initial.status || 'Chưa làm');

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ name, assignee, priority, deadline, status }); }}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên công việc" required />
      <input value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Người được giao" required />
      <select value={priority} onChange={e => setPriority(e.target.value as Priority)}>
        <option value="Thấp">Thấp</option>
        <option value="Trung bình">Trung bình</option>
        <option value="Cao">Cao</option>
      </select>
      <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
      <select value={status} onChange={e => setStatus(e.target.value as Status)}>
        <option value="Chưa làm">Chưa làm</option>
        <option value="Đang làm">Đang làm</option>
        <option value="Đã xong">Đã xong</option>
      </select>
      <button type="submit">Lưu</button>
      {onCancel && <button type="button" onClick={onCancel}>Hủy</button>}
    </form>
  );
};

export default TaskForm;
