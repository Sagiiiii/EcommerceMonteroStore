import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AdminStateService } from 'src/app/services/admin-state.service';
import { GLOBAL } from 'src/app/services/global';

declare var iziToast: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public user_admin:      any    = {};
  public nueva_password:  string = '';
  public load_data:       boolean = true;
  public load_btn:        boolean = false;

  // Foto de perfil
  public fotoPreview: string = 'assets/img/user.png';
  public fotoFile:    File | undefined = undefined;

  private id:    string = '';
  private token: string = '';
  private url:   string = '';

  private readonly TIPOS_IMAGEN = ['image/png','image/jpeg','image/jpg','image/webp','image/gif'];
  private readonly MAX_SIZE     = 4_000_000;

  constructor(
    private _adminService: AdminService,
    private _adminState:   AdminStateService
  ) {}

  ngOnInit(): void {
    this.id    = localStorage.getItem('_id')   ?? '';
    this.token = localStorage.getItem('token') ?? '';
    this.url   = GLOBAL.url;
    this.cargarPerfil();
  }

  fotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    const archivo = input.files[0];

    if (!this.TIPOS_IMAGEN.includes(archivo.type)) {
      this.mostrarError('La foto debe ser una imagen válida (JPG, PNG, WEBP o GIF).');
      return;
    }
    if (archivo.size > this.MAX_SIZE) {
      this.mostrarError('La foto no puede superar los 4 MB.');
      return;
    }

    this.fotoFile = archivo;
    const reader  = new FileReader();
    reader.onload = () => { this.fotoPreview = reader.result as string; };
    reader.readAsDataURL(archivo);
  }

  actualizar(actualizarForm: NgForm): void {
    if (!actualizarForm.valid) {
      this.mostrarError('Complete correctamente todos los campos obligatorios.');
      return;
    }

    if (this.nueva_password.trim()) {
      this.user_admin.password = this.nueva_password.trim();
    } else {
      delete this.user_admin.password;
    }

    this.load_btn = true;

    this._adminService.actualizar_perfil_admin(
      this.id, this.user_admin, this.token, this.fotoFile
    ).subscribe({
      next: (response) => {
        const data = response?.data ?? {};
        this.user_admin     = data;
        this.nueva_password = '';
        this.fotoFile       = undefined;

        this.fotoPreview = data.foto
          ? this.url + 'obtener_foto_admin/' + data.foto + '?t=' + Date.now()
          : 'assets/img/user.png';

        this._adminState.update({
          nombres:   data.nombres   || '',
          apellidos: data.apellidos || '',
          foto:      data.foto      || '',
        });

        this.load_btn = false;
        this.mostrarExito('Su perfil fue actualizado correctamente en MONTERO\'S.');
      },
      error: (err) => {
        console.error('[PerfilComponent] Error al actualizar perfil:', err);
        this.mostrarError('Ocurrió un error al actualizar el perfil. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  private cargarPerfil(): void {
    this._adminService.obtener_admin(this.id, this.token).subscribe({
      next: (response) => {
        this.user_admin  = response?.data ?? {};
        this.fotoPreview = this.user_admin.foto
          ? this.url + 'obtener_foto_admin/' + this.user_admin.foto + '?t=' + Date.now()
          : 'assets/img/user.png';
        this.load_data = false;

        // Sincronizar estado global al cargar
        this._adminState.update({
          nombres:   this.user_admin.nombres   || '',
          apellidos: this.user_admin.apellidos || '',
          foto:      this.user_admin.foto      || '',
        });
      },
      error: (err) => {
        console.error('[PerfilComponent] Error al cargar perfil:', err);
        this.mostrarError('No se pudo cargar el perfil. Intente recargar la página.');
        this.load_data = false;
      }
    });
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({ title: 'Perfil actualizado', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: mensaje });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje });
  }
}
