import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  links = [
    {
      id: 1,
      name: 'Episodes',
      path: '/episodes',
      active: false,
    },
    {
      id: 2,
      name: 'Characters',
      path: '/characters/0',
      active: false,
    },
    {
      id: 3,
      name: 'Favorites',
      path: '/favorites',
      active: false,
    }
  ];

  public selectItem(id: number) {
    this.links.forEach(link => {
      link.active = link.id == id
    });
  }
}
