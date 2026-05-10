import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/global';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-index-administrador',
  templateUrl: './index-administrador.component.html',
  styleUrls: ['./index-administrador.component.css']
})
export class IndexAdministradorComponent implements OnInit {

  public admins:    Array<any> = [];
  public filtro:    string     = '';
  public page:      number     = 1;
  public pageSize:  number     = 10;
  public load_data: boolean    = true;
  public url:       string     = GLOBAL.url;

  public adminAEliminar: any     = null;
  public load_delete:    boolean = false;

  private token:     string | null = null;
  private currentId: string        = '';

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    if (!this.token) { this._router.navigate(['/login']); return; }
    this.currentId = localStorage.getItem('_id') ?? '';
    this.cargarAdmins();
  }

  cargarAdmins(): void {
    this.load_data = true;
    this._adminService.obtener_admins(this.token).subscribe({
      next:  (res) => { this.admins = res.data ?? []; this.load_data = false; },
      error: ()    => {
        this.load_data = false;
        iziToast.show({ title: 'Error', titleColor: '#FF0000', theme: 'dark',
          class: 'text-danger', position: 'topRight',
          message: 'No se pudo cargar el listado de administradores.' });
      }
    });
  }

  get adminsFiltrados(): Array<any> {
    if (!this.filtro.trim()) return this.admins;
    const f = this.filtro.toLowerCase();
    return this.admins.filter(a =>
      (a.nombres + ' ' + a.apellidos).toLowerCase().includes(f) ||
      (a.email   || '').toLowerCase().includes(f) ||
      (a.dni     || '').toString().includes(f)
    );
  }

  editarAdmin(admin: any): void {
    if (admin._id === this.currentId) {
      this._router.navigate(['/panel/perfil']);
    } else {
      this._router.navigate(['/panel/administradores/editar', admin._id]);
    }
  }

  seleccionarParaEliminar(admin: any): void {
    this.adminAEliminar = admin;
    $('#modal-eliminar-admin').modal('show');
  }

  cerrarModal(): void {
    $('#modal-eliminar-admin').modal('hide');
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    this.adminAEliminar = null;
  }

  confirmarEliminar(): void {
    this.load_delete = true;
    this._adminService.eliminar_admin(this.adminAEliminar._id, this.token).subscribe({
      next: () => {
        this.load_delete = false;
        this.cerrarModal();
        iziToast.show({ title: 'Administrador eliminado', titleColor: '#1DC74C',
          theme: 'dark', class: 'text-success', position: 'topRight',
          message: 'El administrador fue eliminado correctamente.' });
        this.cargarAdmins();
      },
      error: () => {
        this.load_delete = false;
        iziToast.show({ title: 'Error', titleColor: '#FF0000', theme: 'dark',
          class: 'text-danger', position: 'topRight',
          message: 'No se pudo eliminar el administrador. Intente nuevamente.' });
      }
    });
  }

  avatarUrl(foto: string): string {
    return foto ? this.url + 'obtener_foto_admin/' + foto : 'assets/img/user.png';
  }

  limpiarFiltro(): void { this.filtro = ''; this.page = 1; }

  min(a: number, b: number): number { return Math.min(a, b); }
}
