import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-icon-sidebar',
  imports: [RouterModule],
  standalone:true,
  templateUrl: './icon-sidebar.html',
  styleUrl: './icon-sidebar.css',
})
export class IconSidebar {
  
  activeRoute: string = '';
  @Input() isOpen =false;
  setActive(route: string) {
    this.activeRoute = route;
}
}
