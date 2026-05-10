import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { JwtHelperService } from '@auth0/angular-jwt';

declare var iziToast: any;

@Component({
  selector: 'app-responder-contacto',
  templateUrl: './responder-contacto.component.html',
  styleUrls: ['./responder-contacto.component.css']
})
export class ResponderContactoComponent implements OnInit {

  public mensaje: any       = {};
  public admins: Array<any> = [];
  public load_data: boolean = true;
  public load_btn:  boolean = false;
  public token: string      = '';
  public adminActual: any   = {};

  public form: any = {
    asunto      : '',
    respuesta   : '',
    correo_admin: '',
    nombre_admin: '',
  };

  // Dato del mensaje pasado desde el listado vía navigation state
  private mensajeState: any = null;

  constructor(
    private _adminService: AdminService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token') ?? '';
    const helper = new JwtHelperService();
    this.adminActual = helper.decodeToken(this.token) ?? {};

    // Leer navigation state antes de que Angular lo descarte
    const nav = this._router.getCurrentNavigation();
    this.mensajeState = nav?.extras?.state?.['mensaje'] ?? null;
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id') ?? '';

    if (this.mensajeState) {
      // Datos disponibles desde el listado — sin petición extra
      this.mensaje = this.mensajeState;
      this.form.asunto = `RESPUESTA a ${this.mensaje.cliente}`;
      this.cargarAdmins();
    } else {
      // Acceso directo por URL — necesita el backend reiniciado
      this.initDataDesdeAPI(id);
    }
  }

  onAdminChange(email: string): void {
    const admin = this.admins.find((a: any) => a.email === email);
    if (admin) {
      this.form.nombre_admin = `${admin.nombres} ${admin.apellidos}`;
    }
  }

  enviar(): void {
    if (!this.form.respuesta?.trim()) {
      this.mostrarError('La respuesta no puede estar vacía.');
      return;
    }
    this.load_btn = true;
    const id = this._route.snapshot.paramMap.get('id') ?? '';

    this._adminService.responder_mensaje_admin(id, this.form, this.token).subscribe({
      next: () => {
        this.mostrarExito('Respuesta enviada correctamente al cliente.');
        this.load_btn = false;
        setTimeout(() => this._router.navigate(['/panel/contactos']), 1800);
      },
      error: (err: any) => {
        console.error('[ResponderContacto]', err);
        this.mostrarError('Error al enviar la respuesta. Intente nuevamente.');
        this.load_btn = false;
      }
    });
  }

  volver(): void {
    this._router.navigate(['/panel/contactos']);
  }

  private cargarAdmins(): void {
    this._adminService.obtener_admins(this.token).subscribe({
      next: (res) => {
        this.admins = res?.data ?? [];
        const porDefecto = this.admins.find((a: any) => a.email === this.adminActual.email)
                        ?? this.admins[0];
        if (porDefecto) {
          this.form.correo_admin = porDefecto.email;
          this.form.nombre_admin = `${porDefecto.nombres} ${porDefecto.apellidos}`;
        }
        this.load_data = false;
      },
      error: () => { this.load_data = false; }
    });
  }

  private initDataDesdeAPI(id: string): void {
    this._adminService.obtener_detalle_mensaje_admin(id, this.token).subscribe({
      next: (res) => {
        this.mensaje = res?.data ?? {};
        this.form.asunto = `RESPUESTA a ${this.mensaje.cliente}`;
        this.cargarAdmins();
      },
      error: () => {
        this.mostrarError('No se pudo cargar el mensaje.');
        this._router.navigate(['/panel/contactos']);
      }
    });
  }

  private mostrarExito(msg: string): void {
    iziToast.show({ title: 'Enviado', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: msg });
  }

  private mostrarError(msg: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: msg });
  }
}
