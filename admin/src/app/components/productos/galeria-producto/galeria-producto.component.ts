import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;
declare var $: any;

// ════════════════════════════════════════════════════════════════
//  GaleriaProductoComponent
//  Gestión de la galería de imágenes de un producto en MONTERO'S.
//  Permite subir nuevas imágenes y eliminar las existentes.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent implements OnInit {

  // ── Modelo del producto ───────────────────────────────────────
  public producto: any = {};

  // ── Identificadores ───────────────────────────────────────────
  public id:    string = '';
  public token: string = '';
  public url:   string = '';

  // ── Manejo de imagen ──────────────────────────────────────────
  public file: File | undefined = undefined;

  // ── Estados de UI ─────────────────────────────────────────────
  public load_btn:          boolean = false;
  public load_btn_eliminar: boolean = false;

  // ── Tipos permitidos ──────────────────────────────────────────
  private readonly TIPOS_PERMITIDOS: string[] = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'
  ];
  private readonly TAMANO_MAXIMO: number = 4_000_000;

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _route:           ActivatedRoute,
    private _productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.url   = GLOBAL.url;

    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.initData();
    });
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  initData(): void {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe({
      next: (response) => {
        this.producto = response?.data ?? undefined;
      },
      error: (err) => {
        console.error('[GaleriaProductoComponent] Error al cargar producto:', err);
        this.mostrarError('No se pudo cargar el producto.');
      }
    });
  }

  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files[0]) {
      this.file = undefined;
      this.mostrarError('No se seleccionó ninguna imagen.');
      return;
    }

    const archivo = input.files[0];

    if (!this.TIPOS_PERMITIDOS.includes(archivo.type)) {
      this.resetearInput();
      this.mostrarError('El archivo debe ser una imagen válida (JPG, PNG, WEBP o GIF).');
      return;
    }

    if (archivo.size > this.TAMANO_MAXIMO) {
      this.resetearInput();
      this.mostrarError('La imagen no puede superar los 4 MB.');
      return;
    }

    this.file = archivo;
  }

  subirImagen(): void {
    if (!this.file) {
      this.mostrarError('Debe seleccionar una imagen para subir.');
      return;
    }

    this.load_btn = true;
    const data = { imagen: this.file, _id: uuidv4() };

    this._productoService.agregar_imagen_galeria_admin(this.id, data, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('Imagen subida correctamente a la galería.');
        this.resetearInput();
        this.load_btn = false;
        this.initData();
      },
      error: (err) => {
        console.error('[GaleriaProductoComponent] Error al subir imagen:', err);
        this.mostrarError('Ocurrió un error al subir la imagen. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  eliminar(id: string): void {
    this.load_btn_eliminar = true;
    this._productoService.eliminar_imagen_galeria_admin(this.id, { _id: id }, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('Imagen eliminada correctamente de la galería.');
        this.cerrarModal(id);
        this.load_btn_eliminar = false;
        this.initData();
      },
      error: (err) => {
        console.error('[GaleriaProductoComponent] Error al eliminar imagen:', err);
        this.mostrarError('Ocurrió un error al eliminar la imagen. Intente nuevamente.');
        this.load_btn_eliminar = false;
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private resetearInput(): void {
    this.file = undefined;
    const input = document.getElementById('input-img') as HTMLInputElement;
    if (input) input.value = '';
  }

  private cerrarModal(id: string): void {
    $(`#modalGaleria-${id}`).modal('hide');
    $('.modal-backdrop').remove();
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({ title: 'Operación exitosa', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: mensaje });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje });
  }
}
