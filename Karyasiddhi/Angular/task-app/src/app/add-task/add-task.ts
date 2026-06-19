import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../services/task';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.css'],
})
export class AddTask {
  tasks$!:Observable<any[]>;
    showForm = false;
    formChanged = false;
    formattedDate: string = '';
    priorityOptions: any[] = [];



    constructor(private taskService: TaskService,
        private router: Router
    ) { }

     ngOnInit() {
      this.loadTasks();
      this.taskService.getPriorities().subscribe(data => {
      this.priorityOptions = data;
     });
    }

    addTask(title: string, desc: string, priority: string, dueDate: string) {

    if (!title?.trim() || !priority || !dueDate) {
      alert('Please fill all required fields');
      return;
    }
    const [year, month, day] = dueDate.split('-'); 
    const formatted = `${day}/${month}/${year}`;

    const task = {
      title,
      description: desc,
      priority: Number(priority),
      dueDate: formatted,
      status: false
    };

  
    this.taskService.addTask(task).subscribe(() => {
      this.loadTasks();  
      this.router.navigate(['/tasks']);    });
  }

loadTasks() {
  this.tasks$ = this.taskService.getTasks().pipe(
    map(tasks => tasks.map(task => ({ ...task })))
  );
}

  formatDate(value: string) {
    if (!value) return;

    const [year, month, day] = value.split('-');
    this.formattedDate = `${day}/${month}/${year}`;

    console.log('Selected Date:', this.formattedDate);
  }

   isFormValid(title: string, priority: string, dueDate: string): boolean {
    return !!(title?.trim() && priority && dueDate);
  }

getPriorityLabel(value: number): string {
  const found = this.priorityOptions.find(p => p.id === value);
  return found ? found.name : '';
}

goBack() {
  this.router.navigate(['/tasks']);
}
}