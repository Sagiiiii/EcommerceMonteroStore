import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({ providedIn: 'root' })
export class CuponService {
  public url: string;
  constructor(private _http: HttpClient) { this.url = GLOBAL.url; }

  registro_cupon_admin(data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'registro_cupon_admin', data, { headers });
  }
  listar_cupones_filtro_admin(filtro: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'listar_cupones_filtro_admin/' + filtro, { headers });
  }
  obtener_cupon_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_cupon_admin/' + id, { headers });
  }
  actualizar_cupon_admin(id: any, data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_cupon_admin/' + id, data, { headers });
  }
  eliminar_cupon_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_cupon_admin/' + id, { headers });
  }
}
