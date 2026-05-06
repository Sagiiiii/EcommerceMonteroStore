import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente: any = undefined;
  public id: string = '';
  public token: string | null = null;
  public load_btn: boolean = false;
  public load_data: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router,
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (!this.token) {
      this._router.navigate(['/login']);
      return;
    }

    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._cargarCliente();
    });
  }

  /** Carga los datos del cliente desde el servicio. */
  private _cargarCliente(): void {
    this.load_data = true;

    this._clienteService.obtener_cliente_admin(this.id, this.token).subscribe({
      next: (response) => {
        this.cliente = response.data ?? undefined;
        this.load_data = false;
      },
      error: (error) => {
        console.error('[EditCliente] Error al cargar cliente:', error);
        this.cliente = undefined;
        this.load_data = false;
        this._mostrarError(
          'Error al cargar',
          'No se pudieron obtener los datos del cliente. Intente nuevamente.'
        );
      }
    });
  }

  /** Actualiza los datos del cliente en el sistema MONTERO'S. */
  actualizarCliente(form: NgForm): void {
    if (form.invalid) {
      this._mostrarError(
        'Formulario incompleto',
        'Complete todos los campos obligatorios antes de continuar.'
      );
      return;
    }

    this.load_btn = true;

    this._clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe({
      next: (_response) => {
        iziToast.show({
          title: 'ACTUALIZACIÓN EXITOSA',
          titleColor: '#1DC74C',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: 'Los datos del cliente fueron actualizados correctamente en MONTERO\'S.',
          timeout: 4000,
        });

        this.load_btn = false;
        this._router.navigate(['/panel/clientes']);
      },
      error: (error) => {
        console.error('[EditCliente] Error al actualizar cliente:', error);
        const mensaje = error?.error?.message
          || 'Ocurrió un error al actualizar el cliente. Intente nuevamente.';
        this._mostrarError('Error en la actualización', mensaje);
        this.load_btn = false;
      }
    });
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
