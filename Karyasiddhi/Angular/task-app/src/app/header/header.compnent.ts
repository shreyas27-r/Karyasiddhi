import { Component,Output,EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  menuOpen = false;
@Output() toggleMenu = new EventEmitter<void>;

  toggle() {
    this.toggleMenu.emit();
  }
}
