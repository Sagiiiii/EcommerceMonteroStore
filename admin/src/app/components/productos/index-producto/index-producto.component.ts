import { Component, OnInit, HostListener } from '@angular/core';
import { GLOBAL } from 'src/app/services/global';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public productos: Array<any> = [];
  public load_data: boolean = true;
  public load_btn:  boolean = false;
  public page:     number = 1;
  public pageSize: number = 10;
  public filtro: string = '';
  public almacenFiltro: string = 'todos';
  public openDropdownId: string | null = null;
  public token: string = '';
  public url:   string = '';

  constructor(private _productoService: ProductoService) {
    this.token = localStorage.getItem('token') ?? '';
    this.url   = GLOBAL.url;
  }

  ngOnInit(): void {
    this.initData();
  }

  @HostListener('document:click')
  cerrarDropdowns(): void {
    this.openDropdownId = null;
  }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  setAlmacen(almacen: string): void {
    this.almacenFiltro = almacen;
    this.page = 1;
    this.initData();
  }

  filtrar(): void {
    this.page = 1;
    this.initData();
  }

  resetear(): void {
    this.filtro = '';
    this.almacenFiltro = 'todos';
    this.page = 1;
    this.initData();
  }

  eliminar(id: string): void {
    this.load_btn = true;
    this._productoService.eliminar_producto_admin(id, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El producto fue eliminado correctamente de MONTERO\'S.');
        this.cerrarModal(id);
        this.load_btn = false;
        this.initData();
      },
      error: (err) => {
        console.error('[IndexProductoComponent] Error al eliminar producto:', err);
        this.mostrarError('Ocurrió un error al eliminar el producto. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  exportExcel(): void {
    const workbook  = new Workbook();
    const worksheet = workbook.addWorksheet('Reporte de productos — MONTERO\'S');

    worksheet.columns = [
      { header: 'ID',               key: 'col1',  width: 26 },
      { header: 'Portada',          key: 'col2',  width: 20 },
      { header: 'Producto',         key: 'col3',  width: 35 },
      { header: 'Almacén',          key: 'col4',  width: 14 },
      { header: 'Stock',            key: 'col5',  width: 12 },
      { header: 'Precio (S/.)',     key: 'col6',  width: 15 },
      { header: 'Categoría',        key: 'col7',  width: 25 },
      { header: 'N° Ventas',        key: 'col8',  width: 12 },
      { header: 'Estado',           key: 'col9',  width: 15 },
      { header: 'Descripción',      key: 'col10', width: 40 },
      { header: 'Fecha de creación',key: 'col11', width: 20 },
    ] as any;

    this.productos.forEach(p => {
      worksheet.addRow([
        p._id, p.portada, p.titulo, p.almacen, p.stock, p.precio,
        p.categoria, p.nventas, p.estado, p.descripcion, p.createdAt
      ]);
    });

    const fname = `productos-monteros-${new Date().valueOf()}`;
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, `${fname}.xlsx`);
    });
  }

  private initData(): void {
    this.load_data = true;
    this._productoService.listar_productos_admin(this.filtro, this.almacenFiltro, this.token).subscribe({
      next: (response) => {
        this.productos  = response?.data ?? [];
        this.load_data  = false;
      },
      error: (err) => {
        console.error('[IndexProductoComponent] Error al cargar productos:', err);
        this.mostrarError('No se pudieron cargar los productos. Intente recargar la página.');
        this.load_data = false;
      }
    });
  }

  abrirModal(id: string, event: Event): void {
    event.stopPropagation();
    this.openDropdownId = null;
    $(`#modalEliminar-${id}`).modal('show');
  }

  cerrarModalBtn(id: string): void {
    $(`#modalEliminar-${id}`).modal('hide');
  }

  private cerrarModal(id: string): void {
    $(`#modalEliminar-${id}`).modal('hide');
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({ title: 'Operación exitosa', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: mensaje });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje });
  }
}
