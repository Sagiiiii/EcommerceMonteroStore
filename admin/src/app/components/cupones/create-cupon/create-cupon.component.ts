import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  CreateCuponComponent
//  Registro de nuevos cupones de descuento para MONTERO'S.
//  Permite definir código, tipo (porcentaje / valor fijo),
//  valor del descuento y límite de usos.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-create-cupon',
  templateUrl: './create-cupon.component.html',
  styleUrls: ['./create-cupon.component.css']
})
export class CreateCuponComponent implements OnInit {

  // ── Modelo del cupón ──────────────────────────────────────────
  public cupon: any = {
    tipo: ''
  };

  // ── Estados de UI ─────────────────────────────────────────────
  public load_btn: boolean = false;

  // ── Autenticación ─────────────────────────────────────────────
  public token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _cuponService: CuponService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token') ?? '';
  }

  ngOnInit(): void { }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Registra un nuevo cupón de descuento en MONTERO'S.
   * Requiere que el formulario sea válido.
   */
  registro(registroForm: NgForm): void {
    if (!registroForm.valid) {
      this.mostrarError('Complete correctamente todos los campos del formulario.');
      return;
    }

    this.load_btn = true;

    this._cuponService.registro_cupon_admin(this.cupon, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El cupón fue registrado correctamente en MONTERO\'S.');
        this.load_btn = false;
        this._router.navigate(['/panel/cupones']);
      },
      error: (err) => {
        console.error('[CreateCuponComponent] Error al registrar cupón:', err);
        this.mostrarError('Ocurrió un error al registrar el cupón. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

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
