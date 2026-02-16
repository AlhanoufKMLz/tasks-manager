import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low'
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  private storageKey = 'tasks';
  private tasksSignal = signal<Task[]>([]);
  tasks = this.tasksSignal.asReadonly();

  completedTasks = computed(()=> {
    return this.tasksSignal().filter(task =>  task.completed)
  });
  inProgressTasks = computed(()=> {
    return this.tasksSignal().filter(task =>  !task.completed)
  });

  // load tasks from json and save to storage
  loadTasks() {
    const savedTasks = localStorage.getItem(this.storageKey);
  
    if (savedTasks) {
      this.tasksSignal.set(this.parseTasks(JSON.parse(savedTasks)));
    } else {
      this.http.get<Task[]>('assets/tasks.json').subscribe(tasks => {
        const parsed = this.parseTasks(tasks);
        this.tasksSignal.set(parsed);
        this.saveToStorage(parsed);
      });
    }
  }

  private parseTasks(tasks: any[]): Task[] {
    return tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: new Date(task.dueDate),
    }));
  }

  private saveToStorage(tasks: Task[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  // 
  getTask(id: number){
    return this.tasks().find(task => task.id === id)
  }

  addTask(title: string, description: string, dueDate: string){
    const newTask: Task = {
      id: this.tasks.length + 1,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      dueDate: new Date(dueDate),
      priority: 'medium'
    }

    this.tasksSignal.update((tasks)=> [...tasks, newTask]);
    this.saveToStorage([...this.tasks(), newTask]);
  }

  deleteTask(id: number){
    this.tasksSignal.update((tasks)=> {
      return tasks.filter(task => task.id !== id)
    })
    this.saveToStorage(this.tasks().filter(task => task.id !== id));
  }

  changeTaskStatus(id:number, newStatus: boolean){
    this.tasksSignal.update((tasks) => {
      return tasks.map(task => {
        if(task.id === id){
          return {
            ...task,
            completed: newStatus
          };
        }
        return task;
      });
    });
  }

  getDaysRemaining(dueDate: Date){
    const today = new Date();
    const due = dueDate;
    const diff = due.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days+'d' : 'Expired';
  }
}
