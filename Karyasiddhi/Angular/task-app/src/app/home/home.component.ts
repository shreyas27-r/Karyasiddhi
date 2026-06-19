import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CommonModule,RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  selectedWeek = 'this';
  currentDate: string = '';
  greeting: string = '';
  showForm = false;
  isDropdownOpen = false;
  formattedDate: string = '';


  formatDate(value: string) {
    if (!value) return;

    const [year, month, day] = value.split('-');
    this.formattedDate = `${day}/${month}/${year}`;

    console.log('Selected Date:', this.formattedDate);
  }
  taskCount$!: Observable<number>;
  compCount$!: Observable<number>;
  tasks$!: Observable<any[]>;
  filteredTasks$!: Observable<any[]>;
  selectedFilter = 'This Week';
  formChanged = false;

  selectedFilter$ = new BehaviorSubject<string>('This Week');


  constructor(public taskService: TaskService) { }

  ngOnInit() {
    this.updateTime();
    this.loadTasks();
    this.filteredTasks$ = combineLatest([
      this.tasks$,
      this.selectedFilter$
    ]).pipe(
      map(([tasks, filter]) => this.filterTasks(tasks, filter))
    );

    setInterval(() => this.updateTime(), 60000);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log(this.isDropdownOpen);
  }

  selectFilter(value: string) {
    console.log('Selected:', value); // debug

    this.selectedFilter = value;
    this.selectedFilter$.next(value);

    this.isDropdownOpen = false;
  }

  onWeekChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedWeek = selectElement.value;
    console.log('Selected week:', this.selectedWeek);

    this.loadTasks();
  }

  loadTasks() {
    this.taskCount$ = this.taskService.getTasks().pipe(
      map(tasks => tasks.length)
    );
    this.compCount$ = this.taskService.getTasks().pipe(
      map(tasks => tasks.filter(t => t.status).length)
    );

    this.tasks$ = this.taskService.getTasks().pipe(
      map(tasks => tasks.filter(task => task.priority === 1))
);
  }

  updateTime() {
    const now = new Date();
    const istTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    this.currentDate = istTime.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const hours = istTime.getHours();

    if (hours < 12) this.greeting = 'Good morning';
    else if (hours < 17) this.greeting = 'Good afternoon';
    else if (hours < 21) this.greeting = 'Good evening';
    else this.greeting = 'Good night';
  }

  trackById(index: number, task: any) {
    return task.id;
  }

  

  filterTasks(tasks: any[], filter: string): any[] {
    const today = new Date();

    return tasks.filter(task => {
      if (!task?.dueDate) return false;

      let taskDate: Date;

      if (task.dueDate.includes('/')) {
        const [d, m, y] = task.dueDate.split('/');
        taskDate = new Date(+y, +m - 1, +d);
      } else {
        taskDate = new Date(task.dueDate);
      }

      if (isNaN(taskDate.getTime())) return false;

      switch (filter) {

        case 'Today':
          return taskDate.toDateString() === today.toDateString();

        case 'This Week': {
          const start = new Date(today);
          start.setDate(today.getDate() - today.getDay());

          const end = new Date(start);
          end.setDate(start.getDate() + 6);

          return taskDate >= start && taskDate <= end;
        }

        case 'This Month':
          return taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear();

        case 'Last Week': {
          const start = new Date(today);
          start.setDate(today.getDate() - today.getDay() - 7);

          const end = new Date(start);
          end.setDate(start.getDate() + 6);

          return taskDate >= start && taskDate <= end;
        }

        default:
          return true;
      }
    });
  }

  isFormValid(title: string, priority: string, dueDate: string): boolean {
    return !!(title?.trim() && priority && dueDate);
  }


}
