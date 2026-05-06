import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  LoginComponent
//  Autenticación de administradores del sistema MONTERO'S.
//  Redirige al dashboard si ya existe una sesión activa.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // ── Modelo del formulario ─────────────────────────────────────
  public user: { email: string; password: string } = {
    email:    '',
    password: ''
  };

  // ── Año actual para el pie de página ─────────────────────────
  public currentYear: number = new Date().getFullYear();

  // ── Token de sesión activa ────────────────────────────────────
  private token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken() ?? '';
  }

  ngOnInit(): void {
    // Si ya hay sesión activa, redirigir al dashboard
    if (this.token) {
      this._router.navigate(['/inicio']);
    }
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Procesa el inicio de sesión con las credenciales del formulario.
   */
  login(loginForm: NgForm): void {
    if (!loginForm.valid) {
      this.mostrarError('Por favor, complete correctamente todos los campos.');
      return;
    }

    const credenciales = {
      email:    this.user.email.trim(),
      password: this.user.password
    };

    this._adminService.login_admin(credenciales).subscribe({
      next: (response) => {
        if (!response?.data) {
          this.mostrarError(response?.message ?? 'Credenciales incorrectas. Intente nuevamente.');
          return;
        }
        this.guardarSesion(response);
        this._router.navigate(['/inicio']);
      },
      error: (err) => {
        console.error('[LoginComponent] Error al iniciar sesión:', err);
        this.mostrarError('Ocurrió un error al conectar con el servidor. Intente nuevamente.');
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Guarda el token y el ID de usuario en localStorage.
   */
  private guardarSesion(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('_id',   response.data._id);
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({
      title: 'Error de acceso',
      titleColor: '#FF3B30',
      theme: 'dark',
      class: 'text-danger',
      position: 'topRight',
      message: mensaje
    });
  }
}
