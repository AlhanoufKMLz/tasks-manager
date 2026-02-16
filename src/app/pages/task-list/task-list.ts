import { Component, computed, inject, signal } from '@angular/core';
import { Task, TaskService } from '../../services/task-service';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

export type Filter = 'all' | 'completed' | 'active';
export type Sort = 'creationDay' | 'dueDate' | 'priority';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  taskService = inject(TaskService);
  filter =  signal<Filter>('all');
  sort =  signal<Sort>('creationDay');
  filteredTasks = computed(()=> {
    switch(this.filter()) {
      case 'all':
        return this.taskService.tasks();
      case 'completed':
        return this.taskService.completedTasks();
      case 'active':
        return this.taskService.inProgressTasks();
      default:
        return this.taskService.tasks();
    }
  });

  setFilter(filter: Filter){
    this.filter.set(filter);
  }

  setSort(sort: Sort){
    this.sort.set(sort);
    this.sortBy();
  }

  deleteTask(id: number){
    this.taskService.deleteTask(id);
  }

  sortBy(){
    this.filteredTasks().sort((a, b) => {

      // completed always last
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
  
      switch (this.sort()) {
  
        case 'creationDay':
          return this.compareByCreatedAt(a, b);
  
        case 'dueDate':
          return this.compareByDueDate(a, b);
  
        case 'priority': {
          const priorityDiff = this.compareByPriority(a, b);
          if (priorityDiff !== 0) return priorityDiff;
          return this.compareByDueDate(a, b); // tie-breaker
        }
  
        default:
          return 0;
      }
    }); 
  }

  compareByCreatedAt(a: Task, b: Task): number {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  compareByDueDate (a: Task, b: Task): number {
    const today = Date.now();
  
    const aDue = new Date(a.dueDate).getTime();
    const bDue = new Date(b.dueDate).getTime();
  
    const aExpired = aDue < today;
    const bExpired = bDue < today;
  
    //one is expired
    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;
  
    //both not expired
    return aDue - bDue;
  }

  compareByPriority(a: Task, b: Task): number {
    return this.getPriorityValue(a.priority) - this.getPriorityValue(b.priority);
  }

  getPriorityValue(priority: 'high' | 'medium' | 'low'): number {
    return priority === 'high' ? 1 : priority === 'medium' ? 2 : 3;
  }
}
