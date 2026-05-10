import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarStateService } from './services/sidebar-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  mostrarLayout = false;
  sidebarCollapsed = false;
  private rutasPublicas = ['/login', '/register', '/error404'];
  private subs = new Subscription();

  constructor(private router: Router, private sidebarState: SidebarStateService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.mostrarLayout = !this.rutasPublicas.some(r => url.startsWith(r));
      }
    });

    this.subs.add(
      this.sidebarState.collapsed$.subscribe(val => this.sidebarCollapsed = val)
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
