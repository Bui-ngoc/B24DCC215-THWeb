import React, { useMemo, useState } from 'react';
import type { Task } from '../../models/GroupTaskManager/task';
import styles from '../../pages/GroupTaskManager/groupTaskManager.module.css';

interface TaskCalendarProps {
	tasks: Task[];
}

const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getMonthName(monthIndex: number) {
	return new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(2024, monthIndex, 1));
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
	const [currentDate, setCurrentDate] = useState(new Date());

	const taskByDate = useMemo(() => {
		return tasks.reduce<Record<string, Task[]>>((map, task) => {
			const key = task.deadline;
			if (!map[key]) {
				map[key] = [];
			}
			map[key].push(task);
			return map;
		}, {});
	}, [tasks]);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const startIndex = firstDay.getDay();

	const cells = Array.from({ length: 42 }).map((_, index) => {
		const day = index - startIndex + 1;
		if (day < 1 || day > daysInMonth) {
			return { day: null, tasks: [] };
		}
		const dateKey = new Date(year, month, day).toISOString().slice(0, 10);
		return { day, tasks: taskByDate[dateKey] || [] };
	});

	return (
		<section className={styles.gtmCalendarSection}>
			<div className={styles.gtmCalendarHeader}>
				<button type='button' onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
					Tháng trước
				</button>
				<div className={styles.gtmCalendarTitle}>
					{getMonthName(month)} {year}
				</div>
				<button type='button' onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
					Tháng sau
				</button>
			</div>
			<div className={styles.gtmCalendarGrid}>
				{weekdays.map((day) => (
					<div key={day} className={styles.gtmCalendarWeekday}>
						{day}
					</div>
				))}
				{cells.map((cell, index) => (
					<div key={index} className={styles.gtmCalendarCell}>
						{cell.day ? (
							<>
								<div className={styles.gtmCalendarDayNumber}>{cell.day}</div>
								<div className={styles.gtmCalendarTasks}>
									{cell.tasks.length > 0 ? (
										cell.tasks.map((task) => (
											<div key={task.id} className={styles.gtmCalendarTaskItem}>
												{task.name}
											</div>
										))
									) : (
										<div className={styles.gtmCalendarEmpty}>-</div>
									)}
								</div>
							</>
						) : null}
					</div>
				))}
			</div>
		</section>
	);
};

export default TaskCalendar;
