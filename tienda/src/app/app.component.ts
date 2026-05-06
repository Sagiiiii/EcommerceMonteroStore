import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  title = 'tienda';
  public isDemo = false;

  constructor(private _router: Router) {}

  ngDoCheck(): void {
    this.isDemo = localStorage.getItem('demo_mode') === 'true';
  }

  cerrarDemo(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('demo_mode');
    this.isDemo = false;
    this._router.navigate(['/login']);
  }
}
