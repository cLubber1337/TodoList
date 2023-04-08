import { instance } from 'common/api/common.api';
import { ResponseType } from 'common/types/common.types';
import {UpdateDomainTaskModelType} from "features/Task/task.slice";
import { TaskPriorities, TaskStatuses } from 'common/enums/common.enums';

export const todoListsApi = {
	getTodoLists() {
		return instance.get<TodolistType[]>('todo-lists');
	},
	createTodolist(title: string) {
		return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title});
	},
	deleteTodolist(id: string) {
		return instance.delete<ResponseType>(`todo-lists/${id}`);
	},
	updateTodolist(id: string, title: string) {
		return instance.put<ResponseType>(`todo-lists/${id}`, title);
	},
	getTasks(todolistId: string) {
		return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
	},
	deleteTask(arg: DeleteTaskArgType) {
		return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
	},
	createTask(arg: AddTaskArgType) {
		return instance.post<ResponseType<{
			item: TaskType
		}>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
	},
	updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
		return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
	}
}


export type TodolistType = {
	id: string
	title: string
	addedDate: string
	order: number
}


export type TaskType = {
	description: string
	title: string
	status: TaskStatuses
	priority: TaskPriorities
	startDate: string
	deadline: string
	id: string
	todoListId: string
	order: number
	addedDate: string
}
export type UpdateTaskModelType = {
	title: string
	description: string
	status: TaskStatuses
	priority: TaskPriorities
	startDate: string
	deadline: string
}
type GetTasksResponse = {
	error: string | null
	totalCount: number
	items: TaskType[]
}

export type AddTaskArgType = {
	title: string
	todolistId: string
}
export type DeleteTaskArgType = {
	todolistId: string
	taskId: string
}



export type UpdateTaskArgType = {
	taskId: string,
	domainModel: UpdateDomainTaskModelType,
	todolistId: string
}
