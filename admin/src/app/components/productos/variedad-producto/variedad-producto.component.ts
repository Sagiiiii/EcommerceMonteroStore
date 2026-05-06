import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  VariedadProductoComponent
//  Gestión de variedades (opciones) de un producto del catálogo
//  de MONTERO'S. Permite agregar, eliminar y guardar variedades.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css']
})
export class VariedadProductoComponent implements OnInit {

  // ── Modelos ───────────────────────────────────────────────────
  public producto:      any    = {};
  public nuevaVariedad: string = '';

  // ── Estado UI ─────────────────────────────────────────────────
  public loadBtn: boolean = false;

  // ── Contexto ──────────────────────────────────────────────────
  public  url:   string = '';
  private id:    string = '';
  private token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _route:           ActivatedRoute,
    private _productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.url   = GLOBAL.url;
    this.token = localStorage.getItem('token') ?? '';

    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.cargarProducto();
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private cargarProducto(): void {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe({
      next: (response) => {
        if (!response?.data) { this.producto = undefined; return; }
        this.producto = response.data;

        // Garantiza que variedades siempre sea un array válido
        if (!Array.isArray(this.producto.variedades)) {
          this.producto.variedades = [];
        }
      },
      error: (err) => {
        console.error('[VariedadProductoComponent] Error al cargar producto:', err);
        this.producto = undefined;
      }
    });
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  agregarVariedad(): void {
    const variedad = this.nuevaVariedad.trim();

    if (!variedad) {
      iziToast.show({
        title: 'CAMPO REQUERIDO',
        titleColor: '#FF0000',
        theme: 'dark',
        position: 'topRight',
        message: 'Debe ingresar un nombre para la variedad antes de agregar.'
      });
      return;
    }

    this.producto.variedades.push({ titulo: variedad });
    this.nuevaVariedad = '';
  }

  eliminarVariedad(indice: number): void {
    this.producto.variedades.splice(indice, 1);
  }

  actualizar(): void {
    if (!this.producto.titulo_variedad?.trim()) {
      iziToast.show({
        title: 'CAMPO REQUERIDO',
        titleColor: '#FF0000',
        theme: 'dark',
        position: 'topRight',
        message: 'Debe completar el título de la variedad antes de guardar.'
      });
      return;
    }

    if (this.producto.variedades.length < 1) {
      iziToast.show({
        title: 'SIN VARIEDADES',
        titleColor: '#FF0000',
        theme: 'dark',
        position: 'topRight',
        message: 'Debe agregar al menos una variedad para continuar.'
      });
      return;
    }

    this.loadBtn = true;

    this._productoService.actualizar_producto_variedades_admin(
      {
        titulo_variedad: this.producto.titulo_variedad,
        variedades:      this.producto.variedades
      },
      this.id,
      this.token
    ).subscribe({
      next: () => {
        iziToast.show({
          title: 'ÉXITO',
          titleColor: '#1DC74C',
          theme: 'dark',
          position: 'topRight',
          message: 'Las variedades del producto fueron actualizadas correctamente.'
        });
        this.loadBtn = false;
      },
      error: (err) => {
        console.error('[VariedadProductoComponent] Error al actualizar variedades:', err);
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          theme: 'dark',
          position: 'topRight',
          message: 'Ocurrió un error al guardar los cambios. Intente nuevamente.'
        });
        this.loadBtn = false;
      }
    });
  }
}
