import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GLOBAL } from './global';
import { JwtHelperService } from '@auth0/angular-jwt';

// ════════════════════════════════════════════════════════════════
//  AdminService — MONTERO'S · Panel Administrativo
//  Gestiona: autenticación, perfil, configuración del sistema,
//  mensajes de contacto, ventas y KPIs del dashboard.
// ════════════════════════════════════════════════════════════════

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  // ── Autenticación ─────────────────────────────────────────────

  login_admin(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_admin', data, { headers });
  }

  registro_admin(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'registro_admin', data, { headers });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica que el JWT sea válido, no esté expirado
   * y que el rol del usuario esté en los roles permitidos.
   */
  public isAuthenticate(allowRoles: string[]): boolean {
    const token: string | null = localStorage.getItem('token');
    if (!token) return false;

    try {
      const helper = new JwtHelperService();

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      const decodedToken = helper.decodeToken(token);
      if (!decodedToken) {
        localStorage.removeItem('token');
        return false;
      }

      return allowRoles.includes(decodedToken['role']);

    } catch {
      localStorage.removeItem('token');
      return false;
    }
  }

  // ── Perfil ────────────────────────────────────────────────────

  obtener_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_admin/' + id, { headers });
  }

  actualizar_perfil_admin(id: any, data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_perfil_admin/' + id, data, { headers });
  }

  // ── Configuración ─────────────────────────────────────────────

  obtener_config_admin(token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_config_admin', { headers });
  }

  actualiza_config_admin(id: any, data: any, token: any): Observable<any> {
    if (data.logo) {
      const headers = new HttpHeaders({ 'Authorization': token });
      const fd = new FormData();
      fd.append('titulo',      data.titulo);
      fd.append('serie',       data.serie);
      fd.append('correlativo', data.correlativo);
      fd.append('categorias',  JSON.stringify(data.categorias));
      fd.append('logo',        data.logo);
      return this._http.put(this.url + 'actualiza_config_admin/' + id, fd, { headers });
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
      return this._http.put(this.url + 'actualiza_config_admin/' + id, data, { headers });
    }
  }

  obtener_config_publico(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_publico', { headers });
  }

  // ── Mensajes ──────────────────────────────────────────────────

  obtener_mensaje_admin(token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_mensaje_admin', { headers });
  }

  cerrar_mensaje_admin(id: any, data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'cerrar_mensaje_admin/' + id, data, { headers });
  }

  // ── Ventas ────────────────────────────────────────────────────

  obtener_ventas_admin(desde: any, hasta: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_ventas_admin/' + desde + '/' + hasta, { headers });
  }

  obtener_ordenes_detalle_cliente(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_ordenes_detalle_cliente/' + id, { headers });
  }

  // ── KPIs ──────────────────────────────────────────────────────

  kpi_ganancias_mensuales_admin(token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'kpi_ganancias_mensuales_admin', { headers });
  }

  kpi_mejores_cliente(token: any, fecha_ini: string, fecha_fin: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    const params  = new HttpParams().set('fecha_ini', fecha_ini).set('fecha_fin', fecha_fin);
    return this._http.get(this.url + 'kpi_mejores_cliente', { headers, params });
  }

  kpi_ganancias_diaria_admin(token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'kpi_ganancias_diaria_admin', { headers });
  }

  kpi_mejores_items(token: any, fecha_ini: string, fecha_fin: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    const params  = new HttpParams().set('fecha_ini', fecha_ini).set('fecha_fin', fecha_fin);
    return this._http.get(this.url + 'kpi_mejores_items', { headers, params });
  }
}
