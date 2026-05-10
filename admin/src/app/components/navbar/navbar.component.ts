import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { SidebarStateService } from 'src/app/services/sidebar-state.service';
import { AdminStateService } from 'src/app/services/admin-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public user_admin:    any          = {};
  public collapsed      = false;
  public dropdownOpen   = false;
  public notifOpen      = false;
  public mobileMenuOpen = false;
  public notificaciones: Array<any>  = [];
  public totalAbiertos  = 0;
  public avatarSrc:     string       = 'assets/img/user.png';

  private id:    string = '';
  private token: string = '';
  private sub: Subscription = new Subscription();

  constructor(
    private _adminService: AdminService,
    private _router:       Router,
    private sidebarState:  SidebarStateService,
    private _adminState:   AdminStateService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.id    = localStorage.getItem('_id')   ?? '';
    this.cargarAdmin();
    this.cargarNotificaciones();

    this.sub.add(
      this.sidebarState.collapsed$.subscribe(val => this.collapsed = val)
    );

    this.sub.add(
      this._adminState.profile$.subscribe(profile => {
        this.avatarSrc = this._adminState.avatarUrl(profile.foto, profile.ts);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    document.body.style.overflow = '';
  }

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.dropdownOpen = false;
      this.notifOpen    = false;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) this.notifOpen = false;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  toggleNotif(): void {
    this.notifOpen = !this.notifOpen;
    if (this.notifOpen) {
      this.dropdownOpen = false;
      this.cargarNotificaciones();
    }
  }

  closeNotif(): void {
    this.notifOpen = false;
  }

  abrirMensaje(item: any): void {
    this.notifOpen = false;
    this._router.navigate(['/panel/contactos/responder', item._id], {
      state: { mensaje: item }
    });
  }

  inicialDelCliente(nombre: string): string {
    return nombre?.trim().charAt(0).toUpperCase() || '?';
  }

  // Cierra ambos dropdowns al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.monteros-navbar__user')) {
      this.dropdownOpen = false;
    }
    if (!target.closest('.notif-wrapper')) {
      this.notifOpen = false;
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

  private cargarNotificaciones(): void {
    if (!this.token) return;
    this._adminService.obtener_mensaje_admin(this.token).subscribe({
      next: (res) => {
        const todos = res?.data ?? [];
        this.notificaciones  = todos.slice(0, 5);
        this.totalAbiertos   = todos.filter((m: any) => m.estado === 'Abierto').length;
      },
      error: () => {}
    });
  }
}
