import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { SidebarStateService } from 'src/app/services/sidebar-state.service';
import { ConfigStateService } from 'src/app/services/config-state.service';
import { AdminStateService } from 'src/app/services/admin-state.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public user_admin: any = {};
  public currentYear: number = new Date().getFullYear();
  public collapsed = false;
  public logoSrc: string = 'assets/img/monteros-fondo-negro.png';
  public nombreComercial: string = "MONTERO'S";
  public avatarSrc: string = 'assets/img/user.png';

  private token: string = '';
  private id: string = '';
  private subs = new Subscription();
  private url: string = '';

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    public sidebarState: SidebarStateService,
    public configState: ConfigStateService,
    private _adminState: AdminStateService
  ) {
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') ?? '';
    this.id    = localStorage.getItem('_id')   ?? '';
    this.cargarAdmin();
    this.cargarConfig();

    this.subs.add(
      this.sidebarState.collapsed$.subscribe(val => this.collapsed = val)
    );

    this.subs.add(
      this.configState.config$.subscribe(cfg => {
        this.nombreComercial = cfg.titulo || "MONTERO'S";
        if (cfg.logo) {
          this.logoSrc = this.url + 'obtener_logo/' + cfg.logo;
        }
      })
    );

    this.subs.add(
      this._adminState.profile$.subscribe(profile => {
        this.avatarSrc = this._adminState.avatarUrl(profile.foto, profile.ts);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  toggle(): void {
    this.sidebarState.toggle();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    this._router.navigate(['/login']);
  }

  private cargarAdmin(): void {
    if (!this.id || !this.token) return;
    this._adminService.obtener_admin(this.id, this.token).subscribe({
      next: (response) => {
        const data = response?.data ?? {};
        this.user_admin = data;
        this._adminState.update({
          nombres:   data.nombres   || '',
          apellidos: data.apellidos || '',
          foto:      data.foto      || '',
        });
      },
      error: (err) => { console.error('[SidebarComponent]', err); }
    });
  }

  private cargarConfig(): void {
    this._adminService.obtener_config_publico().subscribe({
      next: (response) => {
        if (response?.data) {
          this.configState.update({
            titulo: response.data.titulo || "MONTERO'S",
            logo:   response.data.logo   || ''
          });
        }
      },
      error: () => {}
    });
  }
}
