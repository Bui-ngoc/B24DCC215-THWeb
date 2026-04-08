import React, { useEffect, useMemo, useState } from 'react';
import type { Task, Status } from '../../models/GroupTaskManager/task';
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
	const [searchName, setSearchName] = useState('');
	const [filterStatus, setFilterStatus] = useState<Status | ''>('');
	const [filterAssignee, setFilterAssignee] = useState('');
	const [showMyTasks, setShowMyTasks] = useState(false);

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

	const handleAssignSelf = (id: string) => {
		if (!user) return;
		const task = tasks.find((item) => item.id === id);
		if (!task) return;
		const updated = { ...task, assignee: user };
		taskService.updateTask(updated);
		setTasks(taskService.getTasks());
	};

	const assigneeOptions = useMemo(() => {
		const names = Array.from(new Set(tasks.map((task) => task.assignee).filter(Boolean)));
		return names.sort();
	}, [tasks]);

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			const matchName = task.name.toLowerCase().includes(searchName.trim().toLowerCase());
			const matchStatus = filterStatus ? task.status === filterStatus : true;
			const matchAssignee = filterAssignee ? task.assignee === filterAssignee : true;
			const matchMine = showMyTasks && user ? task.assignee === user : true;
			return matchName && matchStatus && matchAssignee && matchMine;
		});
	}, [tasks, searchName, filterStatus, filterAssignee, showMyTasks, user]);

	const totalCount = filteredTasks.length;
	const doneCount = filteredTasks.filter((task) => task.status === 'Đã xong').length;

	console.log('TaskList render:', { user, tasks: tasks.length, filteredTasks: filteredTasks.length, searchName, filterStatus, filterAssignee, showMyTasks });

	if (!user) {
		// Nếu mất user, reload lại trang để về login
		return null;
	}

	return (
		<div className={styles.gtmContainer}>
			<UserDisplay username={user} />
			<button className={styles.gtmLogoutBtn} onClick={handleLogout}>
				Đăng xuất
			</button>
			<h2>Danh sách công việc</h2>
			<div className={styles.gtmToolbar}>
				<button
					className={styles.gtmAddBtn}
					onClick={() => {
						setShowForm(true);
						setEditing(null);
					}}
				>
					Thêm công việc
				</button>
				<div className={styles.gtmStats}>
					<span>Tổng: {totalCount}</span>
					<span>Đã hoàn thành: {doneCount}</span>
				</div>
			</div>
			{showForm && (
				<TaskForm
					initial={editing || {}}
					onSubmit={editing ? handleUpdate : handleAdd}
					onCancel={() => {
						setShowForm(false);
						setEditing(null);
					}}
				/>
			)}
			<div className={styles.gtmFilters} style={{ border: '2px solid red', padding: '10px', margin: '10px 0', backgroundColor: '#ffebee' }}>
				<input
					value={searchName}
					onChange={(e) => setSearchName(e.target.value)}
					placeholder='Tìm theo tên công việc'
				/>
				<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | '')}>
					<option value=''>Tất cả trạng thái</option>
					<option value='Chưa làm'>Chưa làm</option>
					<option value='Đang làm'>Đang làm</option>
					<option value='Đã xong'>Đã xong</option>
				</select>
				<select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
					<option value=''>Tất cả người được giao</option>
					{assigneeOptions.map((name) => (
						<option key={name} value={name}>
							{name}
						</option>
					))}
				</select>
				<label className={styles.gtmFilterCheckbox}>
					<input type='checkbox' checked={showMyTasks} onChange={(e) => setShowMyTasks(e.target.checked)} />
					Công việc của tôi
				</label>
			</div>
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
					{filteredTasks.map((task) => (
						<TaskItem
							key={task.id}
							task={task}
							currentUser={user}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onAssignSelf={handleAssignSelf}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TaskList;
