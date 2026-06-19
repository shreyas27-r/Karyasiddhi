import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './tasks/tasks.component';
import { HelppComponent } from './helpp/helpp.component';
import { AddTask } from './add-task/add-task';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'helpp', component: HelppComponent },
  {path:'add-task', component: AddTask},
  { path: '**', redirectTo: '' }
];