import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css'],
})
export class TasksComponent implements OnInit {

  tasks$!:Observable<any[]>;
  currentSort: string = '';
  statusFilter: string = '';    
  showForm = false;
  formattedDate: string = '';
  formChanged = false;
  priorityFilter : string='';


formatDate(value: string) {
  if (!value) return;

  const [year, month, day] = value.split('-');
  this.formattedDate = `${day}/${month}/${year}`;

  console.log('Selected Date:', this.formattedDate);
}

  constructor(public taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();

}

loadTasks() {
  this.tasks$ = this.taskService.getTasks().pipe(
    map(tasks => {
      let temp = tasks.map(task => ({
        ...task,
        status: task.status ?? false
      }));

      // APPLY BOTH FILTERS TOGETHER
      temp = temp.filter(t => {
        let statusMatch = true;
        let priorityMatch = true;

        // Status filter
        if (this.statusFilter) {
          if (this.statusFilter === 'completed') {
            statusMatch = t.status === true;
          } else if (this.statusFilter === 'pending') {
            statusMatch = t.status === false;
          }
        }

        //Priority filter
        if (this.priorityFilter) {
          priorityMatch = t.priority === Number(this.priorityFilter);
        }

        // Only include tasks that match BOTH filters
        return statusMatch && priorityMatch;
      });

      // SORT
      if (this.currentSort) {
        const parseDate = (d: string) => {
          if (!d) return 0;
          if (d.includes('/')) {
            const [day, month, year] = d.split('/');
            return new Date(`${year}-${month}-${day}`).getTime();
          }
          return new Date(d).getTime();
        };

        temp = temp.sort((a, b) => {
          const dateA = parseDate(a.dueDate);
          const dateB = parseDate(b.dueDate);
          return this.currentSort === 'near' ? dateA - dateB : dateB - dateA;
        });
      }

      return temp;
    })
  );
}

trackById(index: number, task: any) {
  return task.id;
}

onFilterChange(event: Event, type: 'status' | 'priority') {
  const value = (event.target as HTMLSelectElement).value;

  if (type === 'status') {
    this.statusFilter = value;
  } else if (type === 'priority') {
    this.priorityFilter = value;
  }

  this.loadTasks(); // reload tasks with new filters
}

onSortChange(event: Event) {
  this.currentSort = (event.target as HTMLSelectElement).value;
  this.loadTasks(); 
}

markCompleted(task: any) {

  if (task.status) return;

  task.status = true;

  this.taskService.updateTask(task.id, task).subscribe({
    next: () => console.log('Task updated'),
    error: (err) => console.error(err)
  });
}


isFormValid(title: string, priority: number, dueDate: string): boolean {
  return !!(title?.trim() && priority && dueDate);
}

}