import { Injectable, signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  private tasksSignal = signal<Task[]>([
    {
      id: 1,
      title: 'Learn Angular Basics',
      description: 'Understand components, services, and routing',
      completed: true,
      createdAt: new Date('2026-01-02'),
    },
    {
      id: 2,
      title: 'Build a Project',
      description: 'Create a task manager application',
      completed: false,
      createdAt: new Date('2026-02-15'),
    }
  ]);

  tasks = this.tasksSignal.asReadonly();

  getTask(id: number){
    return this.tasks().find(task => task.id === id)
  }

  addTask(title: string, description: string){
    const task: Task = {
      id: this.tasks.length + 1,
      title,
      description,
      completed: false,
      createdAt: new Date()
    }

    this.tasksSignal.update((tasks)=> [...tasks, task]);
  }
}
