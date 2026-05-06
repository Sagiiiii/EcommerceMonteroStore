import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  PerfilComponent
//  Gestión del perfil del administrador del sistema MONTERO'S.
//  Permite visualizar y actualizar datos personales:
//  nombres, apellidos, teléfono, fecha de nacimiento,
//  DNI y contraseña.
//  El correo electrónico es de solo lectura.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  // ── Modelo del administrador ──────────────────────────────────
  public user_admin: any = {};

  // ── Campo de contraseña (binding Angular puro, sin jQuery) ────
  public nueva_password: string = '';

  // ── Estados de UI ─────────────────────────────────────────────
  public load_data: boolean = true;
  public load_btn:  boolean = false;

  // ── Identificadores de sesión ─────────────────────────────────
  private id:    string = '';
  private token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(private _adminService: AdminService) { }

  ngOnInit(): void {
    this.id    = localStorage.getItem('_id')   ?? '';
    this.token = localStorage.getItem('token') ?? '';
    this.cargarPerfil();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Actualiza el perfil del administrador en MONTERO'S.
   * Si se completó la contraseña, la incluye en el payload.
   */
  actualizar(actualizarForm: NgForm): void {
    if (!actualizarForm.valid) {
      this.mostrarError('Complete correctamente todos los campos obligatorios.');
      return;
    }

    // Solo incluir contraseña si el administrador escribió una nueva
    if (this.nueva_password.trim()) {
      this.user_admin.password = this.nueva_password.trim();
    } else {
      delete this.user_admin.password;
    }

    this.load_btn = true;

    this._adminService.actualizar_perfil_admin(this.id, this.user_admin, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('Su perfil fue actualizado correctamente en MONTERO\'S.');
        this.nueva_password = ''; // limpiar campo de contraseña tras guardar
        this.load_btn = false;
      },
      error: (err) => {
        console.error('[PerfilComponent] Error al actualizar perfil:', err);
        this.mostrarError('Ocurrió un error al actualizar el perfil. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga los datos del administrador autenticado desde el servidor.
   */
  private cargarPerfil(): void {
    this._adminService.obtener_admin(this.id, this.token).subscribe({
      next: (response) => {
        this.user_admin = response?.data ?? {};
        this.load_data  = false;
      },
      error: (err) => {
        console.error('[PerfilComponent] Error al cargar perfil:', err);
        this.mostrarError('No se pudo cargar el perfil. Intente recargar la página.');
        this.load_data = false;
      }
    });
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Perfil actualizado',
      titleColor: '#1DC74C',
      theme: 'dark',
      class: 'text-success',
      position: 'topRight',
      message: mensaje
    });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({
      title: 'Error',
      titleColor: '#FF3B30',
      theme: 'dark',
      class: 'text-danger',
      position: 'topRight',
      message: mensaje
    });
  }
}
