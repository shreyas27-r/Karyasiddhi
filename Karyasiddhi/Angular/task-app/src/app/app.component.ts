import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./footer/footer";
import { IconSidebar } from './icon-sidebar/icon-sidebar';
import { HeaderComponent } from './header/header.compnent';
import { TaskService } from './services/task';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, Footer, HeaderComponent, IconSidebar ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class AppComponent {
  constructor(public taskService: TaskService) {}
  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  protected readonly title = signal('task-app');
isExpanded: any;

ngOnInit() {
  this.taskService.getPriorities().subscribe(data => {
    this.taskService.setPriorities(data);
  });
}
}
