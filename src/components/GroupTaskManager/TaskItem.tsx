import React from 'react';
import type { Task } from '../../models/GroupTaskManager/task';

interface TaskItemProps {
	task: Task;
	currentUser: string;
	onEdit: (task: Task) => void;
	onDelete: (id: string) => void;
	onAssignSelf: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, currentUser, onEdit, onDelete, onAssignSelf }) => {
	const isAssignedToMe = task.assignee === currentUser;

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
				{!isAssignedToMe && <button onClick={() => onAssignSelf(task.id)}>Giao cho tôi</button>}
			</td>
		</tr>
	);
};

export default TaskItem;
