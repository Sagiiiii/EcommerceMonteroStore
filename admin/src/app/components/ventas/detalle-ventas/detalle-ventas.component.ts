import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/global';

// ════════════════════════════════════════════════════════════════
//  DetalleVentasComponent
//  Vista detallada de una orden de venta en MONTERO'S.
//  Muestra los datos del cliente, dirección de envío,
//  ítems del pedido y totales.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-detalle-ventas',
  templateUrl: './detalle-ventas.component.html',
  styleUrls: ['./detalle-ventas.component.css']
})
export class DetalleVentasComponent implements OnInit {

  // ── Modelos ───────────────────────────────────────────────────
  public orden:    any       = {};
  public detalles: Array<any> = [];

  // ── Estados de UI ─────────────────────────────────────────────
  public load_data: boolean = true;

  // ── Identificadores ───────────────────────────────────────────
  public id:     string = '';
  public token:  string = '';
  public url:    string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _route:        ActivatedRoute,
    private _adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.url   = GLOBAL.url;
    this.token = localStorage.getItem('token') ?? '';

    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.cargarDetalle();
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga el detalle completo de la orden desde el servidor.
   */
  private cargarDetalle(): void {
    this._adminService.obtener_ordenes_detalle_cliente(this.id, this.token).subscribe({
      next: (response) => {
        if (!response?.data) {
          this.orden     = undefined;
          this.load_data = false;
          return;
        }
        this.orden     = response.data;
        this.detalles  = response.detalles ?? [];
        this.load_data = false;
      },
      error: (err) => {
        console.error('[DetalleVentasComponent] Error al cargar detalle de venta:', err);
        this.orden     = undefined;
        this.load_data = false;
      }
    });
  }
}
