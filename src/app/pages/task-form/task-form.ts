import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private taskService = inject(TaskService);
  today = new Date().toISOString().split('T')[0];
  taskForm = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(3)]],
    description: ["", [Validators.required, Validators.minLength(10)]],
    dueDate: ["", [Validators.required]],
  })

  onSubmit(){
    if(this.taskForm.valid){
      const {title, description, dueDate} = this.taskForm.value;
      if(title && description && dueDate){
        this.taskService.addTask(title, description, dueDate);
        this.taskForm.reset()
        this.router.navigate(['/'])
      }
    }
  }
}
