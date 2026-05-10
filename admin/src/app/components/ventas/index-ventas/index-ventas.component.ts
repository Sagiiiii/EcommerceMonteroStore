import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  IndexVentasComponent
//  Listado y gestión de órdenes de venta en MONTERO'S.
//  Permite filtrar por rango de fechas y cambiar el estado
//  de cada orden (Procesando, Enviado, Finalizado, etc.).
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrls: ['./index-ventas.component.css']
})
export class IndexVentasComponent implements OnInit {

  // ── Lista de ventas ───────────────────────────────────────────
  public ventas: Array<any> = [];

  // ── Filtros de fecha ──────────────────────────────────────────
  public desde: string = this.primerDiaMes();
  public hasta: string = this.hoy();

  // ── Paginación ────────────────────────────────────────────────
  public page:     number = 1;
  public pageSize: number = 10;

  // ── Estados de UI ─────────────────────────────────────────────
  public load_data: boolean = true;
  public load_btn:  boolean = false;

  // ── Autenticación ─────────────────────────────────────────────
  private token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _adminService:   AdminService,
    private _productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.initData();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Aplica el filtro de fechas y recarga el listado.
   */
  filtrar(): void {
    this.page = 1;
    this.initData();
  }

  /**
   * Cambia el estado de una orden de venta.
   */
  cambiarEstado(idVenta: string, nuevoEstado: string): void {
    if (!nuevoEstado) {
      this.mostrarError('Seleccione un estado válido para la orden.');
      return;
    }

    this._productoService.actualizar_estado_envio(idVenta, nuevoEstado, this.token).subscribe({
      next: (response) => {
        this.mostrarExito(response?.message ?? 'Estado de la orden actualizado correctamente.');
        this.initData();
      },
      error: (err) => {
        console.error('[IndexVentasComponent] Error al cambiar estado:', err);
        this.mostrarError('No se pudo actualizar el estado. Intente nuevamente.');
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga las ventas desde el servidor aplicando el filtro de fechas.
   * Inicializa `nuevoEstado` en cada venta con el estado actual.
   */
  private initData(): void {
    this.load_data = true;

    this._adminService.obtener_ventas_admin(this.desde, this.hasta, this.token).subscribe({
      next: (response) => {
        const lista: Array<any> = response?.data ?? [];
        // Inicializar nuevoEstado con el estado actual de cada venta
        this.ventas    = lista.map(v => ({ ...v, nuevoEstado: v.estado }));
        this.load_data = false;
      },
      error: (err) => {
        console.error('[IndexVentasComponent] Error al cargar ventas:', err);
        this.mostrarError('No se pudieron cargar las ventas. Intente recargar la página.');
        this.load_data = false;
      }
    });
  }

  private hoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  private primerDiaMes(): string {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Actualizado',
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
