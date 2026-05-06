import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  RegistroComponent
//  Registro de nuevos administradores del sistema MONTERO'S.
//  El rol se asigna en el backend; no se envía desde el frontend.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  // ── Modelo del formulario ─────────────────────────────────────
  public user: {
    nombres:   string;
    apellidos: string;
    email:     string;
    password:  string;
    telefono:  string;
    dni:       string;
  } = {
    nombres:   '',
    apellidos: '',
    email:     '',
    password:  '',
    telefono:  '',
    dni:       ''
  };

  // ── Año actual para el pie de página ─────────────────────────
  public currentYear: number = new Date().getFullYear();

  // ── Autenticación ─────────────────────────────────────────────
  private token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.token = this._adminService.getToken() ?? '';
    // Si ya hay sesión activa, redirigir al dashboard
    if (this.token) {
      this._router.navigate(['/inicio']);
    }
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Registra un nuevo administrador en el sistema de MONTERO'S.
   */
  registro(registerForm: NgForm): void {
    if (!registerForm.valid) {
      this.mostrarError('Complete correctamente todos los campos del formulario.');
      return;
    }

    const payload = {
      nombres:   this.user.nombres.trim(),
      apellidos: this.user.apellidos.trim(),
      email:     this.user.email.trim(),
      password:  this.user.password,
      telefono:  this.user.telefono.trim(),
      dni:       this.user.dni.trim()
      // rol se asigna en el backend, no se envía desde el cliente
    };

    this._adminService.registro_admin(payload).subscribe({
      next: (response) => {
        if (!response?.data) {
          this.mostrarError(response?.message ?? 'No se pudo completar el registro. Intente nuevamente.');
          return;
        }
        this.mostrarExito('Administrador registrado correctamente en MONTERO\'S.');
        this._router.navigate(['/login']);
      },
      error: (err) => {
        console.error('[RegistroComponent] Error al registrar administrador:', err);
        this.mostrarError('Ocurrió un error al conectar con el servidor. Intente nuevamente.');
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Registro exitoso',
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
