import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task-service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
})
export class TaskDetails {
  route = inject(ActivatedRoute);
  router = inject(Router)
  taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  
  statusForm = this.fb.group({
    completed: [false],
  })
  taskId = signal<number | null>(null);
  task = computed(()=> {
    const id = this.taskId();
    if(!id) return undefined;
    return this.taskService.getTask(id);
  })

  constructor(){
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.taskId.set(Number(id));
    }
  }

  deleteTask(){
    const id = this.taskId();
    if(id){
      this.taskService.deleteTask(id);
      this.router.navigate(["/"])
    }
  }
  
  ngOnInit() {
    const id = this.taskId();

    const currentTask = this.task();
    if (currentTask) {
      this.statusForm.patchValue({
        completed: currentTask.completed === true
      });
    }
  
    if(id){
      this.statusForm.get('completed')?.valueChanges.subscribe((completed) => {
        this.taskService.changeTaskStatus(id, completed!);
      });
    }
  }
  

}
