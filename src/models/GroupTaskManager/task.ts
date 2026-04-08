export type Priority = 'Thấp' | 'Trung bình' | 'Cao';
export type Status = 'Chưa làm' | 'Đang làm' | 'Đã xong';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  priority: Priority;
  deadline: string; // ISO string
  status: Status;
}

export interface User {
  username: string;
}
