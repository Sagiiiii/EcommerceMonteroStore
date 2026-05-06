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
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    f_nacimiento: '',
    dni: '',
    genero: '',
  };

  public token: string | null = null;
  public load_btn: boolean = false;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router,
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (!this.token) {
      this._router.navigate(['/login']);
    }
  }

  /**
   * Registra un nuevo cliente en el sistema MONTERO'S.
   */
  registrarCliente(form: NgForm): void {
    if (form.invalid) {
      this._mostrarError(
        'Formulario incompleto',
        'Complete todos los campos obligatorios antes de continuar.'
      );
      return;
    }

    this.load_btn = true;

    this._clienteService.registro_cliente_admin(this.cliente, this.token).subscribe({
      next: (_response) => {
        iziToast.show({
          title: 'REGISTRO EXITOSO',
          titleColor: '#1DC74C',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: 'El cliente fue registrado correctamente en MONTERO\'S.',
          timeout: 4000,
        });

        this._resetFormulario();
        this._router.navigate(['/panel/clientes']);
      },
      error: (error) => {
        console.error('[CreateCliente] Error al registrar cliente:', error);
        const mensaje = error?.error?.message
          || 'Ocurrió un error al registrar el cliente. Intente nuevamente.';
        this._mostrarError('Error en el registro', mensaje);
        this.load_btn = false;
      }
    });
  }

  /** Resetea el modelo del cliente a sus valores iniciales. */
  private _resetFormulario(): void {
    this.cliente = {
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      f_nacimiento: '',
      dni: '',
      genero: '',
    };
    this.load_btn = false;
  }

  /** Muestra una notificación de error estandarizada. */
  private _mostrarError(titulo: string, mensaje: string): void {
    iziToast.show({
      title: titulo,
      titleColor: '#FF0000',
      theme: 'dark',
      class: 'text-danger',
      position: 'topRight',
      message: mensaje,
      timeout: 5000,
    });
  }
}
