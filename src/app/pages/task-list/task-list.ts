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

  deleteTask(id: number){
    this.taskService.deleteTask(id);
  }

}
