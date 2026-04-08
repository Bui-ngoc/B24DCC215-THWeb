import type { Task } from '../../models/GroupTaskManager/task';

const TASKS_KEY = 'group_tasks';

export function getTasks(): Task[] {
	const data = localStorage.getItem(TASKS_KEY);
	return data ? JSON.parse(data) : [];
}

export function saveTasks(tasks: Task[]) {
	localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTask(task: Task) {
	const tasks = getTasks();
	tasks.push(task);
	saveTasks(tasks);
}

export function updateTask(updated: Task) {
	const tasks = getTasks().map((t) => (t.id === updated.id ? updated : t));
	saveTasks(tasks);
}

export function deleteTask(id: string) {
	const tasks = getTasks().filter((t) => t.id !== id);
	saveTasks(tasks);
}
