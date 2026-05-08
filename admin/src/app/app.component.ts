import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mostrarLayout = false;
  private rutasPublicas = ['/login', '/register', '/error404'];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.mostrarLayout = !this.rutasPublicas.some(r => url.startsWith(r));
      }
    });
  }
}
