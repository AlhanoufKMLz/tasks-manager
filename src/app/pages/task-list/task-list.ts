import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  taskService = inject(TaskService);
  filter =  signal<'all' | 'completed' | 'active'>('all');
  sort =  signal<'creationDay' | 'dueDate'>('creationDay');
  filteredTasks = computed(()=> {
    switch(this.filter()) {
      case 'all':
        return this.taskService.tasks();
      case 'completed':
        return this.taskService.completedTasks();
      case 'active':
        return this.taskService.activeTasks();
      default:
        return this.taskService.tasks();
    }
  });

  setFilter(filter: 'all' | 'completed' | 'active'){
    this.filter.set(filter);
  }

  setSort(sort: 'creationDay' | 'dueDate'){
    this.sort.set(sort);
    this.sortBy();
  }

  deleteTask(id: number){
    this.taskService.deleteTask(id);
  }

  sortBy(){
    if(this.sort() == 'creationDay'){
      this.filteredTasks().sort((a, b) => { 
        const aCreated = new Date(a.createdAt).getTime();
        const bCreated = new Date(b.createdAt).getTime();
  
        // both completed
        if (a.completed && b.completed) return aCreated - bCreated;
  
        // one is complete
        if (a.completed ) return 1;
        if (b.completed) return -1;
  
        // both not completed
        return aCreated - bCreated;
      });
    }

    if (this.sort() === 'dueDate') {
      this.filteredTasks().sort((a, b) => {
        const today = new Date().getTime();
  
        const aDue = new Date(a.dueDate).getTime();
        const bDue = new Date(b.dueDate).getTime();
  
        const aExpired = aDue < today;
        const bExpired = bDue < today;
  
        // both expired
        if (aExpired && bExpired) return aDue - bDue;
  
        // one is expired
        if (aExpired) return 1;
        if (bExpired) return -1;
  
        // both not expired
        return aDue - bDue;
      });
    }
  }

}
