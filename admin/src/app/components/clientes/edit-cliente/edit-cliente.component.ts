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

  public cliente:      any            = undefined;
  public id:           string         = '';
  public token:        string | null  = null;
  public load_btn:     boolean        = false;
  public load_data:    boolean        = true;

  public localidad_sel:  string = 'Huancayo';
  public localidad_otro: string = '';

  constructor(
    private _route: ActivatedRoute,
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router,
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (!this.token) { this._router.navigate(['/login']); return; }
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._cargarCliente();
    });
  }

  private _cargarCliente(): void {
    this.load_data = true;
    this._clienteService.obtener_cliente_admin(this.id, this.token).subscribe({
      next: (response) => {
        this.cliente   = response.data ?? undefined;
        this.load_data = false;

        if (this.cliente) {
          const loc = this.cliente.localidad || 'Huancayo';
          if (loc === 'Huancayo' || loc === 'Ayacucho') {
            this.localidad_sel  = loc;
            this.localidad_otro = '';
          } else {
            this.localidad_sel  = 'Otro';
            this.localidad_otro = loc;
          }
        }
      },
      error: () => {
        this.cliente   = undefined;
        this.load_data = false;
        this._mostrarError('Error al cargar', 'No se pudieron obtener los datos del cliente. Intente nuevamente.');
      }
    });
  }

  actualizarCliente(form: NgForm): void {
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

    this._clienteService.actualizar_cliente_admin(this.id, this.cliente, this.token).subscribe({
      next: (_response) => {
        iziToast.show({
          title: 'ACTUALIZACIÓN EXITOSA', titleColor: '#1DC74C', theme: 'dark',
          class: 'text-success', position: 'topRight',
          message: 'Los datos del cliente fueron actualizados correctamente en MONTERO\'S.', timeout: 4000,
        });
        this.load_btn = false;
        this._router.navigate(['/panel/clientes']);
      },
      error: (error) => {
        const mensaje = error?.error?.message || 'Ocurrió un error al actualizar el cliente. Intente nuevamente.';
        this._mostrarError('Error en la actualización', mensaje);
        this.load_btn = false;
      }
    });
  }

  private _mostrarError(titulo: string, mensaje: string): void {
    iziToast.show({ title: titulo, titleColor: '#FF0000', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje, timeout: 5000 });
  }
}
