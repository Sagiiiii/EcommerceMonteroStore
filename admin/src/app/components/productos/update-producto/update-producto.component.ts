import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/global';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  UpdateProductoComponent
//  Edición y actualización de productos del catálogo MONTERO'S.
//  Carga el producto por ID desde la ruta activa y permite
//  modificar todos sus campos incluyendo la portada.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  // ── Modelo del producto ───────────────────────────────────────
  public producto: any = {};

  // ── Configuración global (categorías) ────────────────────────
  public config_global: any = {};

  // ── Manejo de imagen / portada ────────────────────────────────
  public file: File | undefined = undefined;
  public imgSelect: string | ArrayBuffer = 'assets/img/imagen-no-disponible_1.jpg';

  // ── Estados de UI ─────────────────────────────────────────────
  public load_btn: boolean = false;

  // ── Identificadores ───────────────────────────────────────────
  public id:    string = '';
  public token: string = '';
  public url:   string = '';

  // ── Tipos de imagen permitidos ────────────────────────────────
  private readonly TIPOS_PERMITIDOS: string[] = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'
  ];
  private readonly TAMANO_MAXIMO: number = 4_000_000;

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _route:           ActivatedRoute,
    private _productoService: ProductoService,
    private _adminService:    AdminService,
    private _router:          Router
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.url   = GLOBAL.url;
    this.cargarConfigGlobal();

    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.cargarProducto();
    });
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Actualiza el producto en el catálogo de MONTERO'S.
   */
  actualizar(actualizarForm: NgForm): void {
    if (!actualizarForm.valid) {
      this.mostrarError('Complete correctamente todos los campos obligatorios.');
      return;
    }

    const payload: any = {
      titulo:      this.producto.titulo,
      stock:       this.producto.stock,
      precio:      this.producto.precio,
      categoria:   this.producto.categoria,
      descripcion: this.producto.descripcion,
      contenido:   this.producto.contenido
    };

    if (this.file) {
      payload.portada = this.file;
    }

    this.load_btn = true;

    this._productoService.actualizar_producto_admin(payload, this.id, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El producto fue actualizado correctamente en MONTERO\'S.');
        this.load_btn = false;
        this._router.navigate(['/panel/productos']);
      },
      error: (err) => {
        console.error('[UpdateProductoComponent] Error al actualizar producto:', err);
        this.mostrarError('Ocurrió un error al actualizar el producto. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  /**
   * Maneja el cambio de archivo para la portada del producto.
   */
  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files[0]) {
      this.resetearImagen();
      this.mostrarError('No se seleccionó ninguna imagen.');
      return;
    }

    const archivo = input.files[0];

    if (!this.TIPOS_PERMITIDOS.includes(archivo.type)) {
      this.resetearImagen();
      this.mostrarError('El archivo debe ser una imagen válida (JPG, PNG, WEBP o GIF).');
      return;
    }

    if (archivo.size > this.TAMANO_MAXIMO) {
      this.resetearImagen();
      this.mostrarError('La imagen no puede superar los 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => { if (reader.result) this.imgSelect = reader.result; };
    reader.readAsDataURL(archivo);
    this.file = archivo;
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private cargarProducto(): void {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe({
      next: (response) => {
        if (!response?.data) { this.producto = undefined; return; }
        this.producto  = response.data;
        this.imgSelect = this.url + 'obtener_portada/' + this.producto.portada;
      },
      error: (err) => {
        console.error('[UpdateProductoComponent] Error al cargar producto:', err);
        this.mostrarError('No se pudo cargar el producto. Intente recargar la página.');
        this.producto = undefined;
      }
    });
  }

  private cargarConfigGlobal(): void {
    this._adminService.obtener_config_publico().subscribe({
      next: (response) => { this.config_global = response?.data ?? {}; },
      error: (err) => { console.error('[UpdateProductoComponent] Error al cargar config:', err); }
    });
  }

  private resetearImagen(): void {
    this.imgSelect = 'assets/img/imagen-no-disponible_1.jpg';
    this.file = undefined;
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({ title: 'Actualización exitosa', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: mensaje });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje });
  }
}
