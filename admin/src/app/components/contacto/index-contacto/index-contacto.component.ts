import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var $: any;
declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  IndexContactoComponent
//  Gestión de mensajes de contacto recibidos en MONTERO'S.
//  Permite visualizar, paginar y cerrar los mensajes
//  enviados por clientes a través del formulario de contacto.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css']
})
export class IndexContactoComponent implements OnInit {

  // ── Lista de mensajes ─────────────────────────────────────────
  public mensajes: Array<any> = [];

  // ── Estados de carga ──────────────────────────────────────────
  public load_data: boolean = true;
  public load_btn:  boolean = false;

  // ── Paginación ────────────────────────────────────────────────
  public page:     number = 1;
  public pageSize: number = 10;

  // ── Autenticación ─────────────────────────────────────────────
  public token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token') ?? '';
  }

  // ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.initData();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  responder(item: any): void {
    this._router.navigate(['/panel/contactos/responder', item._id], {
      state: { mensaje: item }
    });
  }

  /**
   * Cierra un mensaje por su ID.
   * Actualiza el estado en el servidor y refresca el listado.
   */
  cerrar(id: string): void {
    this.load_btn = true;

    this._adminService.cerrar_mensaje_admin(id, { data: undefined }, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('El mensaje fue cerrado correctamente en MONTERO\'S.');
        this.cerrarModal(id);
        this.initData();
        this.load_btn = false;
      },
      error: (err) => {
        console.error('[IndexContactoComponent] Error al cerrar mensaje:', err);
        this.mostrarError('No se pudo cerrar el mensaje. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga todos los mensajes de contacto desde el servidor.
   */
  private initData(): void {
    this.load_data = true;

    this._adminService.obtener_mensaje_admin(this.token).subscribe({
      next: (response) => {
        this.mensajes  = response?.data ?? [];
        this.load_data = false;
      },
      error: (err) => {
        console.error('[IndexContactoComponent] Error al obtener mensajes:', err);
        this.mostrarError('No se pudieron cargar los mensajes. Intente recargar la página.');
        this.load_data = false;
      }
    });
  }

  /**
   * Cierra el modal de confirmación correspondiente al mensaje.
   * Usa jQuery mínimo para compatibilidad con Bootstrap 4.
   */
  private cerrarModal(id: string): void {
    $(`#modalCerrar-${id}`).modal('hide');
    $('.modal-backdrop').remove();
  }

  /**
   * Muestra una notificación de éxito con iziToast.
   */
  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Operación exitosa',
      titleColor: '#1DC74C',
      theme: 'dark',
      class: 'text-success',
      position: 'topRight',
      message: mensaje
    });
  }

  /**
   * Muestra una notificación de error con iziToast.
   */
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
