import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var $: any;
declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  IndexCuponComponent
//  Listado, búsqueda y eliminación de cupones de descuento
//  del sistema administrativo de MONTERO'S.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  // ── Lista de cupones ──────────────────────────────────────────
  public cupones: Array<any> = [];

  // ── Estados de UI ─────────────────────────────────────────────
  public load_data: boolean = true;

  // ── Paginación ────────────────────────────────────────────────
  public page:     number = 1;
  public pageSize: number = 5;

  // ── Filtro de búsqueda ────────────────────────────────────────
  public filtro: string = '';

  // ── Autenticación ─────────────────────────────────────────────
  public token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _cuponService: CuponService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token') ?? '';
  }

  ngOnInit(): void {
    this.initData();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Ejecuta la búsqueda con el filtro actual.
   * Reinicia la paginación a la primera página.
   */
  filtrar(): void {
    this.page = 1;
    this.initData();
  }

  /**
   * Elimina un cupón por su ID y refresca el listado.
   */
  eliminar(id: string): void {
    this._cuponService.eliminar_cupon_admin(id, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El cupón fue eliminado correctamente de MONTERO\'S.');
        this.cerrarModal(id);
        this.initData();
      },
      error: (err) => {
        console.error('[IndexCuponComponent] Error al eliminar cupón:', err);
        this.mostrarError('No se pudo eliminar el cupón. Intente nuevamente.');
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga el listado de cupones aplicando el filtro activo.
   */
  private initData(): void {
    this.load_data = true;

    this._cuponService.listar_cupones_filtro_admin(this.filtro, this.token).subscribe({
      next: (response) => {
        this.cupones   = response?.data ?? [];
        this.load_data = false;
      },
      error: (err) => {
        console.error('[IndexCuponComponent] Error al cargar cupones:', err);
        this.mostrarError('No se pudieron cargar los cupones. Intente recargar la página.');
        this.load_data = false;
      }
    });
  }

  /**
   * Cierra el modal de confirmación de eliminación.
   */
  private cerrarModal(id: string): void {
    $(`#modalEliminar-${id}`).modal('hide');
    $('.modal-backdrop').remove();
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Operación exitosa',
      titleColor: '#1DC74C',
      theme: 'dark',
      class: 'text-success',
      position: 'topRight',
      message: mensaje
    });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({
      title: 'Error',
      titleColor: '#FF3B30',
      theme: 'dark',
      class: 'text-danger',
      position: 'topRight',
      message: mensaje
    });
  }
}
