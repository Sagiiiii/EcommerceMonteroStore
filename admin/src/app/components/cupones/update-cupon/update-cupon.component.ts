import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  UpdateCuponComponent
//  Edición y actualización de cupones de descuento en MONTERO'S.
//  Carga el cupón por ID desde la ruta y permite modificar
//  todos sus campos: código, tipo, valor y límite.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css']
})
export class UpdateCuponComponent implements OnInit {

  // ── Modelo del cupón ──────────────────────────────────────────
  public cupon: any = { tipo: '' };

  // ── Estados de UI ─────────────────────────────────────────────
  public load_btn:  boolean = false;
  public load_data: boolean = true;

  // ── Identificador del cupón ───────────────────────────────────
  public id: string = '';

  // ── Autenticación ─────────────────────────────────────────────
  public token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _cuponService:  CuponService,
    private _router:        Router,
    private _route:         ActivatedRoute
  ) {
    this.token = localStorage.getItem('token') ?? '';
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.cargarCupon();
    });
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Actualiza los datos del cupón en MONTERO'S.
   * Requiere que el formulario sea válido.
   */
  actualizar(actualizarForm: NgForm): void {
    if (!actualizarForm.valid) {
      this.mostrarError('Complete correctamente todos los campos del formulario.');
      return;
    }

    this.load_btn = true;

    this._cuponService.actualizar_cupon_admin(this.id, this.cupon, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El cupón fue actualizado correctamente en MONTERO\'S.');
        this.load_btn = false;
        this._router.navigate(['/panel/cupones']);
      },
      error: (err) => {
        console.error('[UpdateCuponComponent] Error al actualizar cupón:', err);
        this.mostrarError('Ocurrió un error al actualizar el cupón. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga los datos del cupón desde el servidor por su ID.
   */
  private cargarCupon(): void {
    this._cuponService.obtener_cupon_admin(this.id, this.token).subscribe({
      next: (response) => {
        this.cupon     = response?.data ?? undefined;
        this.load_data = false;
      },
      error: (err) => {
        console.error('[UpdateCuponComponent] Error al cargar cupón:', err);
        this.mostrarError('No se pudo cargar el cupón. Intente recargar la página.');
        this.cupon     = undefined;
        this.load_data = false;
      }
    });
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
