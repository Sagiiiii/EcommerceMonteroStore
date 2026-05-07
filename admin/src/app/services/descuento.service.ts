import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({ providedIn: 'root' })
export class DescuentoService {
  public url: string;
  constructor(private _http: HttpClient) { this.url = GLOBAL.url; }

  registro_descuento_admin(data: any, file: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': token });
    const fd = new FormData();
    fd.append('titulo', data.titulo); fd.append('descuento', data.descuento);
    fd.append('fecha_inicio', data.fecha_inicio); fd.append('fecha_fin', data.fecha_fin);
    fd.append('banner', file);
    return this._http.post(this.url + 'registro_descuento_admin', fd, { headers });
  }
  listar_descuento_admin(filtro: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'listar_descuento_admin/' + filtro, { headers });
  }
  eliminar_descuento_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_descuento_admin/' + id, { headers });
  }
  obtener_descuento_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_descuento_admin/' + id, { headers });
  }
  actualizar_descuento_admin(data: any, id: any, token: any): Observable<any> {
    if (data.banner) {
      const headers = new HttpHeaders({ 'Authorization': token });
      const fd = new FormData();
      fd.append('titulo', data.titulo); fd.append('descuento', data.descuento);
      fd.append('fecha_inicio', data.fecha_inicio); fd.append('fecha_fin', data.fecha_fin);
      fd.append('banner', data.banner);
      return this._http.put(this.url + 'actualizar_descuento_admin/' + id, fd, { headers });
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
      return this._http.put(this.url + 'actualizar_descuento_admin/' + id, data, { headers });
    }
  }
}
