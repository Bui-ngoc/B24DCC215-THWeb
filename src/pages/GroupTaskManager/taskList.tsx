import React, { useEffect, useState } from 'react';
import type { Task } from '../../models/GroupTaskManager/task';
import * as taskService from '../../services/GroupTaskManager/taskService';
import TaskItem from '../../components/GroupTaskManager/TaskItem';
import TaskForm from '../../components/GroupTaskManager/TaskForm';
import TaskCalendar from '../../components/GroupTaskManager/TaskCalendar';
import UserDisplay from '../../components/GroupTaskManager/UserDisplay';
import styles from './groupTaskManager.module.css';

const USER_KEY = 'group_task_user';

const TaskList: React.FC = () => {
	const [user, setUser] = useState<string | null>(null);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [editing, setEditing] = useState<Task | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [statusFilter, setStatusFilter] = useState<'Tất cả' | 'Chưa làm' | 'Đang làm' | 'Đã xong'>('Tất cả');
	const [searchKeyword, setSearchKeyword] = useState('');

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

	const userTasks = user ? tasks.filter((task) => task.assignee === user) : tasks;
	const filteredTasks = userTasks.filter((task) => {
		const matchesStatus = statusFilter === 'Tất cả' || task.status === statusFilter;
		const matchesKeyword = task.name.toLowerCase().includes(searchKeyword.trim().toLowerCase());
		return matchesStatus && matchesKeyword;
	});

	const totalTasks = userTasks.length;
	const completedTasks = userTasks.filter((task) => task.status === 'Đã xong').length;

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
			<h2>Danh sách công việc của bạn</h2>
			<h3 className={styles.gtmSectionTitle}>Thống kê</h3>
			<div className={styles.gtmSummarySection}>
				<div className={styles.gtmSummaryCard}>
					<div className={styles.gtmSummaryLabel}>Tổng số công việc của bạn</div>
					<div className={styles.gtmSummaryValue}>{totalTasks}</div>
				</div>
				<div className={styles.gtmSummaryCard}>
					<div className={styles.gtmSummaryLabel}>Công việc đã hoàn thành</div>
					<div className={styles.gtmSummaryValue}>{completedTasks}</div>
				</div>
			</div>
			<TaskCalendar tasks={userTasks} />
			<div className={styles.gtmFilterSection}>
				<input
					className={styles.gtmSearchInput}
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					placeholder='Tìm kiếm theo tên công việc'
				/>
				<select
					className={styles.gtmFilterSelect}
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as any)}
				>
					<option value='Tất cả'>Tất cả trạng thái</option>
					<option value='Chưa làm'>Chưa làm</option>
					<option value='Đang làm'>Đang làm</option>
					<option value='Đã xong'>Đã xong</option>
				</select>
			</div>
			<button
				className={styles.gtmAddBtn}
				onClick={() => {
					setShowForm(true);
					setEditing(null);
				}}
			>
				Thêm công việc
			</button>
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
						<TaskItem key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TaskList;
