import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-administrador',
  templateUrl: './create-administrador.component.html',
  styleUrls: ['./create-administrador.component.css']
})
export class CreateAdministradorComponent {

  public admin: any = {
    nombres: '', apellidos: '', email: '',
    password: '', telefono: '', dni: ''
  };
  public load_btn: boolean = false;

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {}

  registrar(form: NgForm): void {
    if (form.invalid) return;
    this.load_btn = true;

    this._adminService.registro_admin(this.admin).subscribe({
      next: (response) => {
        if (response?.data) {
          iziToast.show({ title: 'Administrador registrado', titleColor: '#1DC74C',
            theme: 'dark', class: 'text-success', position: 'topRight',
            message: 'El administrador fue creado correctamente en MONTERO\'S.' });
          this._router.navigate(['/panel/administradores']);
        } else {
          iziToast.show({ title: 'Aviso', titleColor: '#FF9500', theme: 'dark',
            class: 'text-warning', position: 'topRight',
            message: response?.message || 'No se pudo registrar el administrador.' });
          this.load_btn = false;
        }
      },
      error: () => {
        iziToast.show({ title: 'Error', titleColor: '#FF0000', theme: 'dark',
          class: 'text-danger', position: 'topRight',
          message: 'Ocurrió un error al registrar. Intente nuevamente.' });
        this.load_btn = false;
      }
    });
  }
}
