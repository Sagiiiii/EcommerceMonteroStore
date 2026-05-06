import { Component, OnInit } from '@angular/core';
import { DescuentoService } from 'src/app/services/descuento.service';
import { GLOBAL } from 'src/app/services/global';

declare var $: any;
declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  IndexDescuentoComponent
//  Listado, búsqueda y eliminación de campañas de descuento
//  del sistema administrativo de MONTERO'S.
//
//  El estado de cada descuento se calcula en el cliente
//  comparando las fechas de inicio/fin con la fecha actual:
//  - Próximamente : aún no ha comenzado
//  - En progreso  : dentro del rango de vigencia
//  - Expirado     : fuera del rango de vigencia
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css']
})
export class IndexDescuentoComponent implements OnInit {

  // ── Lista de descuentos ───────────────────────────────────────
  public descuentos: Array<any> = [];

  // ── Estados de UI ─────────────────────────────────────────────
  public load_data: boolean = true;
  public load_btn:  boolean = false;

  // ── Paginación ────────────────────────────────────────────────
  public page:     number = 1;
  public pageSize: number = 10;

  // ── Filtro de búsqueda ────────────────────────────────────────
  public filtro: string = '';

  // ── Contexto ──────────────────────────────────────────────────
  public token: string = '';
  public url:   string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(private _descuentoService: DescuentoService) {
    this.token = localStorage.getItem('token') ?? '';
    this.url   = GLOBAL.url;
  }

  ngOnInit(): void {
    this.initData();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Ejecuta búsqueda con el filtro actual.
   * Permite filtro vacío para mostrar todos los registros.
   */
  filtrar(): void {
    this.page = 1;
    this.initData();
  }

  /**
   * Limpia el filtro y recarga todos los descuentos.
   */
  resetear(): void {
    this.filtro = '';
    this.page   = 1;
    this.initData();
  }

  /**
   * Elimina una campaña de descuento por su ID.
   */
  eliminar(id: string): void {
    this.load_btn = true;

    this._descuentoService.eliminar_descuento_admin(id, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El descuento fue eliminado correctamente de MONTERO\'S.');
        this.cerrarModal(id);
        this.load_btn = false;
        this.initData();
      },
      error: (err) => {
        console.error('[IndexDescuentoComponent] Error al eliminar descuento:', err);
        this.mostrarError('Ocurrió un error al eliminar el descuento. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga el listado de descuentos y calcula su estado de vigencia.
   */
  private initData(): void {
    this.load_data = true;

    this._descuentoService.listar_descuento_admin(this.filtro, this.token).subscribe({
      next: (response) => {
        const lista: Array<any> = response?.data ?? [];
        this.descuentos = lista.map(item => ({
          ...item,
          estado: this.calcularEstado(item.fecha_inicio, item.fecha_fin)
        }));
        this.load_data = false;
      },
      error: (err) => {
        console.error('[IndexDescuentoComponent] Error al cargar descuentos:', err);
        this.mostrarError('No se pudieron cargar los descuentos. Intente recargar la página.');
        this.load_data = false;
      }
    });
  }

  /**
   * Calcula el estado de vigencia de un descuento según sus fechas.
   */
  private calcularEstado(fechaInicio: string, fechaFin: string): string {
    const inicio = Date.parse(fechaInicio + 'T00:00:00') / 1000;
    const fin    = Date.parse(fechaFin    + 'T00:00:00') / 1000;
    const hoy    = Date.now() / 1000;

    if (hoy < inicio)               return 'Próximamente';
    if (hoy >= inicio && hoy <= fin) return 'En progreso';
    return 'Expirado';
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
