import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  title = 'admin';
  public isDemo = false;

  ngDoCheck(): void {
    this.isDemo = localStorage.getItem('demo_mode') === 'true';
  }
}
