import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  CreateProductoComponent
//  Registro de nuevos productos en el catálogo de MONTERO'S.
//  Permite definir título, stock, precio, categoría,
//  descripción, contenido enriquecido y portada.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  // ── Modelo del producto ───────────────────────────────────────
  public producto: any = { categoria: '' };

  // ── Configuración global (categorías) ────────────────────────
  public config_global: any = {};

  // ── Manejo de imagen / portada ────────────────────────────────
  public file: File | undefined = undefined;
  public imgSelect: string | ArrayBuffer = 'assets/img/imagen-no-disponible_1.jpg';

  // ── Estados de UI ─────────────────────────────────────────────
  public load_btn: boolean = false;

  // ── Autenticación ─────────────────────────────────────────────
  public token: string = '';

  // ── Tipos de imagen permitidos ────────────────────────────────
  private readonly TIPOS_PERMITIDOS: string[] = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'
  ];
  private readonly TAMANO_MAXIMO: number = 4_000_000;

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.token = this._adminService.getToken() ?? '';
    this.cargarConfigGlobal();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Registra un nuevo producto en el catálogo de MONTERO'S.
   */
  registro(registroForm: NgForm): void {
    if (!registroForm.valid) {
      this.mostrarError('Complete correctamente todos los campos obligatorios.');
      return;
    }
    if (!this.file) {
      this.mostrarError('Debe subir una imagen de portada para registrar el producto.');
      return;
    }

    this.load_btn = true;

    this._productoService.registro_producto_admin(this.producto, this.file, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El producto fue registrado correctamente en MONTERO\'S.');
        this.load_btn = false;
        this._router.navigate(['/panel/productos']);
      },
      error: (err) => {
        console.error('[CreateProductoComponent] Error al registrar producto:', err);
        this.mostrarError('Ocurrió un error al registrar el producto. Intente nuevamente.');
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
    reader.onload = () => {
      if (reader.result) this.imgSelect = reader.result;
    };
    reader.readAsDataURL(archivo);
    this.file = archivo;
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private cargarConfigGlobal(): void {
    this._adminService.obtener_config_publico().subscribe({
      next: (response) => { this.config_global = response?.data ?? {}; },
      error: (err) => { console.error('[CreateProductoComponent] Error al cargar config:', err); }
    });
  }

  private resetearImagen(): void {
    this.imgSelect = 'assets/img/imagen-no-disponible_1.jpg';
    this.file = undefined;
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({ title: 'Registro exitoso', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: mensaje });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje });
  }
}
