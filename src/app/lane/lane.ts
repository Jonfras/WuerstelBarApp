import { Task } from "../task/task";

export interface Lane {
    id: number;
    title: string;
    tasks: Task[];
}