import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit {

  public cliente: any = {
    nombres: '', apellidos: '', email: '',
    telefono: '', f_nacimiento: '', dni: '', genero: '', localidad: 'Huancayo',
  };

  public localidad_sel: string  = 'Huancayo';
  public localidad_otro: string = '';

  public token:    string | null = null;
  public load_btn: boolean       = false;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router,
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (!this.token) { this._router.navigate(['/login']); }
  }

  registrarCliente(form: NgForm): void {
    if (form.invalid) {
      this._mostrarError('Formulario incompleto', 'Complete todos los campos obligatorios antes de continuar.');
      return;
    }
    if (this.localidad_sel === 'Otro' && !this.localidad_otro.trim()) {
      this._mostrarError('Campo requerido', 'Especifique el lugar de la localidad.');
      return;
    }

    this.cliente.localidad = this.localidad_sel === 'Otro'
      ? this.localidad_otro.trim()
      : this.localidad_sel;

    this.load_btn = true;

    this._clienteService.registro_cliente_admin(this.cliente, this.token).subscribe({
      next: (_response) => {
        iziToast.show({
          title: 'REGISTRO EXITOSO', titleColor: '#1DC74C', theme: 'dark',
          class: 'text-success', position: 'topRight',
          message: 'El cliente fue registrado correctamente en MONTERO\'S.', timeout: 4000,
        });
        this._resetFormulario();
        this._router.navigate(['/panel/clientes']);
      },
      error: (error) => {
        const mensaje = error?.error?.message || 'Ocurrió un error al registrar el cliente. Intente nuevamente.';
        this._mostrarError('Error en el registro', mensaje);
        this.load_btn = false;
      }
    });
  }

  private _resetFormulario(): void {
    this.cliente = { nombres: '', apellidos: '', email: '', telefono: '', f_nacimiento: '', dni: '', genero: '', localidad: 'Huancayo' };
    this.localidad_sel  = 'Huancayo';
    this.localidad_otro = '';
    this.load_btn = false;
  }

  private _mostrarError(titulo: string, mensaje: string): void {
    iziToast.show({ title: titulo, titleColor: '#FF0000', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje, timeout: 5000 });
  }
}
