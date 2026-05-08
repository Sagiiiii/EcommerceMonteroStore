import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { SidebarStateService } from 'src/app/services/sidebar-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public user_admin: any = {};
  public collapsed = false;
  public dropdownOpen = false;     // ← controla el dropdown

  private id:    string = '';
  private token: string = '';
  private sub: Subscription = new Subscription();

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    private sidebarState: SidebarStateService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.id    = localStorage.getItem('_id')   ?? '';
    this.cargarAdmin();

    this.sub = this.sidebarState.collapsed$.subscribe(val => {
      this.collapsed = val;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  // Cierra el dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.monteros-navbar__user')) {
      this.dropdownOpen = false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    this._router.navigate(['/login']);
  }

  private cargarAdmin(): void {
    if (!this.id || !this.token) return;
    this._adminService.obtener_admin(this.id, this.token).subscribe({
      next: (response) => { this.user_admin = response?.data ?? {}; },
      error: (err) => { console.error('[NavbarComponent]', err); }
    });
  }
}
