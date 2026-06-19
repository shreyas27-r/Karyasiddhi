import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  status: boolean;
  title: string;
  description?: string;
  priority: number;
  dueDate: string; // dd/MM/yyyy
  
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'https://localhost:7040/api/tasks'; 
  
    priorityOptions: any[] = [];

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  // POST a new task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }


  updateTask(id: number, task: any) {
    return this.http.put(`${this.baseUrl}/${id}`, task);
  }

  getPriorities() {
    return this.http.get<any[]>(`${this.baseUrl}/priorities`);
  }

  getPriorityLabel(value: number): string {
    const found = this.priorityOptions.find(p => p.id === value);
    return found ? found.name : '';
  }

  setPriorities(data: any[]) {
    this.priorityOptions = data;
  }

}