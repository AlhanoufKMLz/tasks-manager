import { Routes } from '@angular/router';

import { TaskList } from './pages/task-list/task-list';
import { TaskForm } from './pages/task-form/task-form';
import { TaskDetails } from './pages/task-details/task-details';

export const routes: Routes = [
    {
        path: "",
        component: TaskList
    },
    {
        path: "add-task",
        component: TaskForm
    },
    {
        path: "task/:id",
        component: TaskDetails
    }
];
