import { computed, Injectable, signal } from '@angular/core';
import { filter } from 'rxjs';

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
  private tasksSignal = signal<Task[]>([
    {
      id: 1,
      title: 'Learn Angular Basics',
      description: 'Understand components, services, and routing',
      completed: true,
      createdAt: new Date('2026-01-02'),
      dueDate: new Date('2026-01-12'),
      priority: 'high'
    },
    {
      id: 2,
      title: 'Build a Project',
      description: 'Create a task manager application',
      completed: false,
      createdAt: new Date('2026-02-15'),
      dueDate: new Date('2026-03-02'),
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Study TypeScript',
      description: 'Learn types, interfaces, and generics',
      completed: false,
      createdAt: new Date('2026-01-10'),
      dueDate: new Date('2026-04-05'),
      priority: 'high'
    },
    {
      id: 4,
      title: 'Learn RxJS',
      description: 'Understand Observables and Subjects',
      completed: false,
      createdAt: new Date('2026-01-20'),
      dueDate: new Date('2026-07-02'),
      priority: 'low'
    },
    {
      id: 5,
      title: 'Set Up Backend',
      description: 'Build REST API with Node.js',
      completed: true,
      createdAt: new Date('2026-01-25'),
      dueDate: new Date('2026-04-15'),
      priority: 'low'
    },
    {
      id: 6,
      title: 'Connect Frontend to Backend',
      description: 'Use HTTPClient to fetch and post data',
      completed: false,
      createdAt: new Date('2026-02-01'),
      dueDate: new Date('2026-03-12'),
      priority: 'medium'
    },
    {
      id: 7,
      title: 'Add Authentication',
      description: 'Implement login, register, and guards',
      completed: true,
      createdAt: new Date('2026-02-05'),
      dueDate: new Date('2026-05-09'),
      priority: 'high'
    },
    {
      id: 8,
      title: 'Implement Task Filters',
      description: 'Filter tasks by completed or pending',
      completed: false,
      createdAt: new Date('2026-02-08'),
      dueDate: new Date('2026-08-23'),
      priority: 'high'
    },
    {
      id: 9,
      title: 'Write Unit Tests',
      description: 'Test components and services with Jasmine',
      completed: false,
      createdAt: new Date('2026-02-12'),
      dueDate: new Date('2026-04-06'),
      priority: 'medium'
    },
    {
      id: 10,
      title: 'Deploy Application',
      description: 'Deploy to Firebase or Netlify',
      completed: false,
      createdAt: new Date('2026-02-14'),
      dueDate: new Date('2026-11-07'),
      priority: 'low'
    }
  ]);
  
  tasks = this.tasksSignal.asReadonly();

  completedTasks = computed(()=> {
    return this.tasksSignal().filter(task =>  task.completed)
  });
  activeTasks = computed(()=> {
    return this.tasksSignal().filter(task =>  !task.completed)
  });

  getTask(id: number){
    return this.tasks().find(task => task.id === id)
  }

  addTask(title: string, description: string, dueDate: string){
    const task: Task = {
      id: this.tasks.length + 1,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      dueDate: new Date(dueDate),
      priority: 'medium'
    }

    this.tasksSignal.update((tasks)=> [...tasks, task]);
  }

  deleteTask(id: number){
    this.tasksSignal.update((tasks)=> {
      return tasks.filter(task => task.id !== id)
    })
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
