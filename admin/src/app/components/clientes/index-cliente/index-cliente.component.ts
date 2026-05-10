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

  public clientes:         Array<any> = [];
  public filtro_apellidos: string     = '';
  public filtro_correo:    string     = '';
  public tabActivo:        string     = 'todos';
  public page:             number     = 1;
  public pageSize:         number     = 10;
  public token:            string | null = null;
  public load_data:        boolean    = true;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router,
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (!this.token) { this._router.navigate(['/login']); return; }
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.load_data = true;
    this._clienteService.listar_clientes_filtro_admin(null, null, this.token).subscribe({
      next: (response) => { this.clientes = response.data ?? []; this.load_data = false; },
      error: () => {
        this.load_data = false;
        this._mostrarError('Error al cargar', 'No se pudo obtener el listado de clientes. Intente nuevamente.');
      }
    });
  }

  filtrar(tipo: 'apellidos' | 'correo'): void {
    const valor = tipo === 'apellidos' ? this.filtro_apellidos.trim() : this.filtro_correo.trim();
    if (!valor) { this.cargarClientes(); return; }

    this.load_data = true;
    this.page = 1;

    this._clienteService.listar_clientes_filtro_admin(tipo, valor, this.token).subscribe({
      next: (response) => { this.clientes = response.data ?? []; this.load_data = false; },
      error: () => {
        this.load_data = false;
        this._mostrarError('Error en búsqueda', 'No se pudo realizar la búsqueda. Intente nuevamente.');
      }
    });
  }

  limpiarFiltros(): void {
    this.filtro_apellidos = '';
    this.filtro_correo    = '';
    this.page = 1;
    this.cargarClientes();
  }

  cambiarTab(tab: string): void {
    this.tabActivo = tab;
    this.page = 1;
  }

  get clientesFiltradosPorTab(): Array<any> {
    if (this.tabActivo === 'huancayo') {
      return this.clientes.filter(c => (c.localidad || 'Huancayo') === 'Huancayo');
    }
    if (this.tabActivo === 'ayacucho') {
      return this.clientes.filter(c => (c.localidad || '') === 'Ayacucho');
    }
    if (this.tabActivo === 'otros') {
      return this.clientes.filter(c => {
        const loc = c.localidad || 'Huancayo';
        return loc !== 'Huancayo' && loc !== 'Ayacucho';
      });
    }
    return this.clientes;
  }

  countTab(tab: string): number {
    if (tab === 'todos') return this.clientes.length;
    if (tab === 'huancayo') return this.clientes.filter(c => (c.localidad || 'Huancayo') === 'Huancayo').length;
    if (tab === 'ayacucho') return this.clientes.filter(c => (c.localidad || '') === 'Ayacucho').length;
    return this.clientes.filter(c => { const loc = c.localidad || 'Huancayo'; return loc !== 'Huancayo' && loc !== 'Ayacucho'; }).length;
  }

  eliminarCliente(id: string): void {
    this._clienteService.eliminar_cliente_admin(id, this.token).subscribe({
      next: (_response) => {
        iziToast.show({
          title: 'ELIMINACIÓN EXITOSA', titleColor: '#1DC74C', theme: 'dark',
          class: 'text-success', position: 'topRight',
          message: 'El cliente fue eliminado correctamente del sistema MONTERO\'S.', timeout: 4000,
        });
        $(`#modal-delete-${id}`).modal('hide');
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        this.cargarClientes();
      },
      error: (error) => {
        const mensaje = error?.error?.message || 'No se pudo eliminar el cliente. Intente nuevamente.';
        this._mostrarError('Error al eliminar', mensaje);
      }
    });
  }

  min(a: number, b: number): number { return Math.min(a, b); }

  private _mostrarError(titulo: string, mensaje: string): void {
    iziToast.show({ title: titulo, titleColor: '#FF0000', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje, timeout: 5000 });
  }
}
