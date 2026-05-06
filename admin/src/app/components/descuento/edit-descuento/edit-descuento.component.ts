import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DescuentoService } from 'src/app/services/descuento.service';
import { GLOBAL } from 'src/app/services/global';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  EditDescuentoComponent
//  Edición y actualización de campañas de descuento en MONTERO'S.
//  Carga el descuento por ID desde la ruta y permite modificar
//  título, fechas, porcentaje y banner promocional.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-edit-descuento',
  templateUrl: './edit-descuento.component.html',
  styleUrls: ['./edit-descuento.component.css']
})
export class EditDescuentoComponent implements OnInit {

  // ── Modelo del descuento ──────────────────────────────────────
  public descuentos: any = {};

  // ── Manejo de imagen / banner ─────────────────────────────────
  public file: File | undefined = undefined;
  public imgSelect: string | ArrayBuffer = 'assets/img/imagen-no-disponible_1.jpg';

  // ── Estados de UI ─────────────────────────────────────────────
  public load_btn: boolean = false;

  // ── Identificador y contexto ──────────────────────────────────
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
    private _descuentoService: DescuentoService,
    private _router:          Router
  ) {
    this.token = localStorage.getItem('token') ?? '';
    this.url   = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.cargarDescuento();
    });
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Actualiza los datos del descuento en MONTERO'S.
   */
  actualizar(actualizarForm: NgForm): void {
    if (!actualizarForm.valid) {
      this.mostrarError('Complete correctamente todos los campos del formulario.');
      return;
    }

    if (this.descuentos.descuento < 1 || this.descuentos.descuento > 100) {
      this.mostrarError('El porcentaje de descuento debe estar entre 1% y 100%.');
      return;
    }

    this.load_btn = true;

    const payload: any = {
      titulo:       this.descuentos.titulo,
      descuento:    this.descuentos.descuento,
      fecha_inicio: this.descuentos.fecha_inicio,
      fecha_fin:    this.descuentos.fecha_fin
    };

    if (this.file) {
      payload.banner = this.file;
    }

    this._descuentoService.actualizar_descuento_admin(payload, this.id, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El descuento fue actualizado correctamente en MONTERO\'S.');
        this.load_btn = false;
        this._router.navigate(['/panel/descuentos']);
      },
      error: (err) => {
        console.error('[EditDescuentoComponent] Error al actualizar descuento:', err);
        this.mostrarError('Ocurrió un error al actualizar el descuento. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  /**
   * Maneja el cambio de archivo para el banner del descuento.
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
      if (reader.result) {
        this.imgSelect = reader.result;
      }
    };
    reader.readAsDataURL(archivo);
    this.file = archivo;
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga los datos del descuento desde el servidor por su ID.
   */
  private cargarDescuento(): void {
    this._descuentoService.obtener_descuento_admin(this.id, this.token).subscribe({
      next: (response) => {
        if (!response?.data) {
          this.descuentos = undefined;
          return;
        }
        this.descuentos = response.data;
        this.imgSelect  = this.url + 'obtener_banner_descuento/' + this.descuentos.banner;
      },
      error: (err) => {
        console.error('[EditDescuentoComponent] Error al cargar descuento:', err);
        this.mostrarError('No se pudo cargar el descuento. Intente recargar la página.');
        this.descuentos = undefined;
      }
    });
  }

  private resetearImagen(): void {
    this.imgSelect = 'assets/img/imagen-no-disponible_1.jpg';
    this.file = undefined;
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Actualización exitosa',
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
