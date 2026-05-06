import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var $: any;
declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  InventarioProductoComponent
//  Gestión del inventario de un producto en MONTERO'S.
//  Permite registrar nuevas entradas de stock y eliminar
//  registros existentes, con exportación a Excel.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  // ── Modelos ───────────────────────────────────────────────────
  public producto:    any = {};
  public inventario:  any = {};
  public inventarios: Array<any> = [];

  // ── Estados de UI ─────────────────────────────────────────────
  public load_btn: boolean = false;

  // ── Identificadores ───────────────────────────────────────────
  private id:      string = '';
  private idUser:  string = '';
  private token:   string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _route:           ActivatedRoute,
    private _productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.token  = localStorage.getItem('token') ?? '';
    this.idUser = localStorage.getItem('_id')   ?? '';

    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.cargarProducto();
    });
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  registroInventario(inventarioForm: any): void {
    if (!inventarioForm.valid) {
      this.mostrarError('Complete correctamente los campos de cantidad y proveedor.');
      return;
    }

    const data = {
      producto:  this.producto._id,
      cantidad:  inventarioForm.value.cantidad,
      admin:     this.idUser,
      proveedor: inventarioForm.value.proveedor
    };

    this._productoService.registro_inventario_producto_admin(data, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('Stock agregado correctamente al producto en MONTERO\'S.');
        inventarioForm.resetForm();
        this.cargarInventario();
      },
      error: (err) => {
        console.error('[InventarioProductoComponent] Error al registrar inventario:', err);
        this.mostrarError('Ocurrió un error al registrar el inventario. Intente nuevamente.');
      }
    });
  }

  eliminar(id: string): void {
    this.load_btn = true;
    this._productoService.eliminar_inventario_producto_admin(id, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('Registro de inventario eliminado correctamente.');
        this.cerrarModal(id);
        this.load_btn = false;
        this.cargarInventario();
      },
      error: (err) => {
        console.error('[InventarioProductoComponent] Error al eliminar inventario:', err);
        this.mostrarError('Ocurrió un error al eliminar el registro. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  exportExcel(): void {
    const workbook  = new Workbook();
    const worksheet = workbook.addWorksheet(`Inventario — ${this.producto.titulo}`);

    worksheet.columns = [
      { header: 'Trabajador', key: 'col1', width: 30 },
      { header: 'Cantidad',   key: 'col2', width: 15 },
      { header: 'Proveedor',  key: 'col3', width: 25 }
    ] as any;

    this.inventarios.forEach(item => {
      worksheet.addRow([
        `${item.admin?.nombres ?? ''} ${item.admin?.apellidos ?? ''}`.trim(),
        item.cantidad,
        item.proveedor
      ]);
    });

    const fname = `inventario-${this.producto.titulo ?? 'producto'}-${new Date().valueOf()}`;
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${fname}.xlsx`);
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private cargarProducto(): void {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe({
      next: (response) => {
        if (!response?.data) { this.producto = undefined; return; }
        this.producto = response.data;
        this.cargarInventario();
      },
      error: (err) => {
        console.error('[InventarioProductoComponent] Error al cargar producto:', err);
        this.producto = undefined;
      }
    });
  }

  private cargarInventario(): void {
    this._productoService.listar_inventario_producto_admin(this.producto._id, this.token).subscribe({
      next: (response) => { this.inventarios = response?.data ?? []; },
      error: (err) => { console.error('[InventarioProductoComponent] Error al cargar inventario:', err); }
    });
  }

  private cerrarModal(id: string): void {
    $(`#modalInventario-${id}`).modal('hide');
    $('.modal-backdrop').remove();
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({ title: 'Operación exitosa', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: mensaje });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje });
  }
}
