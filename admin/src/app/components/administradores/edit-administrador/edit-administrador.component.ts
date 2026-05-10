import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast: any;

@Component({
  selector: 'app-edit-administrador',
  templateUrl: './edit-administrador.component.html',
  styleUrls: ['./edit-administrador.component.css']
})
export class EditAdministradorComponent implements OnInit {

  public admin:          any     = {};
  public nueva_password: string  = '';
  public load_data:      boolean = true;
  public load_btn:       boolean = false;

  private id:    string        = '';
  private token: string | null = null;

  constructor(
    private _adminService: AdminService,
    private _route:        ActivatedRoute,
    private _router:       Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id') ?? '';
    if (!this.token || !this.id) { this._router.navigate(['/panel/administradores']); return; }
    this.cargarAdmin();
  }

  cargarAdmin(): void {
    this._adminService.obtener_admin(this.id, this.token).subscribe({
      next:  (res) => { this.admin = res.data ?? {}; this.load_data = false; },
      error: ()    => { this._router.navigate(['/panel/administradores']); }
    });
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    if (this.nueva_password.trim()) {
      this.admin.password = this.nueva_password.trim();
    } else {
      delete this.admin.password;
    }

    this.load_btn = true;

    this._adminService.actualizar_perfil_admin(this.id, this.admin, this.token).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res?.data) {
          iziToast.show({ title: 'Datos actualizados', titleColor: '#1DC74C',
            theme: 'dark', class: 'text-success', position: 'topRight',
            message: 'El administrador fue actualizado correctamente.' });
          this._router.navigate(['/panel/administradores']);
        } else {
          iziToast.show({ title: 'Error', titleColor: '#FF0000', theme: 'dark',
            class: 'text-danger', position: 'topRight',
            message: res?.message || 'No se pudo actualizar el administrador.' });
        }
      },
      error: () => {
        this.load_btn = false;
        iziToast.show({ title: 'Error', titleColor: '#FF0000', theme: 'dark',
          class: 'text-danger', position: 'topRight',
          message: 'Ocurrió un error al actualizar. Intente nuevamente.' });
      }
    });
  }
}
