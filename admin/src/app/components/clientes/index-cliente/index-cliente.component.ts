import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes: Array<any> = [];
  public filtro_apellidos: string = '';
  public filtro_correo: string = '';
  public page: number = 1;
  public pageSize: number = 10;
  public token: string | null = null;
  public load_data: boolean = true;

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
      return;
    }
    this.cargarClientes();
  }

  /** Carga el listado completo de clientes sin filtros. */
  cargarClientes(): void {
    this.load_data = true;

    this._clienteService.listar_clientes_filtro_admin(null, null, this.token).subscribe({
      next: (response) => {
        this.clientes = response.data ?? [];
        this.load_data = false;
      },
      error: (error) => {
        console.error('[IndexCliente] Error al cargar clientes:', error);
        this.load_data = false;
        this._mostrarError(
          'Error al cargar',
          'No se pudo obtener el listado de clientes. Intente nuevamente.'
        );
      }
    });
  }

  /** Aplica filtro por apellido o correo electrónico. */
  filtrar(tipo: 'apellidos' | 'correo'): void {
    const valor = tipo === 'apellidos'
      ? this.filtro_apellidos.trim()
      : this.filtro_correo.trim();

    if (!valor) {
      this.cargarClientes();
      return;
    }

    this.load_data = true;
    this.page = 1;

    this._clienteService.listar_clientes_filtro_admin(tipo, valor, this.token).subscribe({
      next: (response) => {
        this.clientes = response.data ?? [];
        this.load_data = false;
      },
      error: (error) => {
        console.error('[IndexCliente] Error al filtrar clientes:', error);
        this.load_data = false;
        this._mostrarError(
          'Error en búsqueda',
          'No se pudo realizar la búsqueda. Intente nuevamente.'
        );
      }
    });
  }

  /** Limpia los filtros y recarga el listado completo. */
  limpiarFiltros(): void {
    this.filtro_apellidos = '';
    this.filtro_correo = '';
    this.page = 1;
    this.cargarClientes();
  }

  /** Elimina un cliente por ID y actualiza la lista. */
  eliminarCliente(id: string): void {
    this._clienteService.eliminar_cliente_admin(id, this.token).subscribe({
      next: (_response) => {
        iziToast.show({
          title: 'ELIMINACIÓN EXITOSA',
          titleColor: '#1DC74C',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: 'El cliente fue eliminado correctamente del sistema MONTERO\'S.',
          timeout: 4000,
        });

        $(`#modal-delete-${id}`).modal('hide');
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');

        this.cargarClientes();
      },
      error: (error) => {
        console.error('[IndexCliente] Error al eliminar cliente:', error);
        const mensaje = error?.error?.message
          || 'No se pudo eliminar el cliente. Intente nuevamente.';
        this._mostrarError('Error al eliminar', mensaje);
      }
    });
  }

  /**
   * Helper para calcular el rango de paginación en el template.
   */
  min(a: number, b: number): number {
    return Math.min(a, b);
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
