import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  CreateDescuentoComponent
//  Registro de nuevas campañas de descuento en MONTERO'S.
//  Permite definir título, rango de fechas, porcentaje
//  de descuento y banner promocional.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-create-descuento',
  templateUrl: './create-descuento.component.html',
  styleUrls: ['./create-descuento.component.css']
})
export class CreateDescuentoComponent implements OnInit {

  // ── Modelo del descuento ──────────────────────────────────────
  public descuento: any = {};

  // ── Manejo de imagen / banner ─────────────────────────────────
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
    private _descuentoService: DescuentoService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token') ?? '';
  }

  ngOnInit(): void { }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Registra una nueva campaña de descuento en MONTERO'S.
   */
  registro(registroForm: NgForm): void {
    if (!registroForm.valid) {
      this.mostrarError('Complete correctamente todos los campos del formulario.');
      return;
    }

    if (!this.file) {
      this.mostrarError('Debe subir un banner para registrar el descuento.');
      return;
    }

    if (this.descuento.descuento < 1 || this.descuento.descuento > 100) {
      this.mostrarError('El porcentaje de descuento debe estar entre 1% y 100%.');
      return;
    }

    this.load_btn = true;

    this._descuentoService.registro_descuento_admin(this.descuento, this.file, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El descuento fue registrado correctamente en MONTERO\'S.');
        this.load_btn = false;
        this._router.navigate(['/panel/descuentos']);
      },
      error: (err) => {
        console.error('[CreateDescuentoComponent] Error al registrar descuento:', err);
        this.mostrarError('Ocurrió un error al registrar el descuento. Intente nuevamente.');
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

  private resetearImagen(): void {
    this.imgSelect = 'assets/img/imagen-no-disponible_1.jpg';
    this.file = undefined;
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Registro exitoso',
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
