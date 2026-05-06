import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

// ════════════════════════════════════════════════════════════════
//  SidebarComponent
//  Barra lateral y navbar del Panel Administrativo MONTERO'S.
//  Muestra el nombre del administrador autenticado y
//  gestiona el cierre de sesión.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // ── Datos del administrador autenticado ───────────────────────
  public user_admin: any = {};

  // ── Año para el pie de página ─────────────────────────────────
  public currentYear: number = new Date().getFullYear();

  // ── Identificadores de sesión ─────────────────────────────────
  private id:    string = '';
  private token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.id    = localStorage.getItem('_id')   ?? '';
    this.cargarAdmin();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Cierra la sesión del administrador:
   * 1. Elimina los datos de localStorage
   * 2. Navega al login
   * El reload se evita — no es necesario y causaba que el token
   * se intentara eliminar después de recargar la página.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    this._router.navigate(['/login']);
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private cargarAdmin(): void {
    if (!this.id || !this.token) return;

    this._adminService.obtener_admin(this.id, this.token).subscribe({
      next: (response) => {
        this.user_admin = response?.data ?? {};
      },
      error: (err) => {
        console.error('[SidebarComponent] Error al cargar administrador:', err);
      }
    });
  }
}
