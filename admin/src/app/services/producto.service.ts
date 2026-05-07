import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  public url: string;
  constructor(private _http: HttpClient) { this.url = GLOBAL.url; }

  registro_producto_admin(data: any, file: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': token });
    const fd = new FormData();
    fd.append('titulo', data.titulo); fd.append('stock', data.stock);
    fd.append('precio', data.precio); fd.append('descripcion', data.descripcion);
    fd.append('contenido', data.contenido); fd.append('categoria', data.categoria);
    fd.append('portada', file);
    return this._http.post(this.url + 'registro_producto_admin', fd, { headers });
  }
  listar_productos_admin(filtro: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'listar_productos_admin/' + filtro, { headers });
  }
  obtener_producto_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_producto_admin/' + id, { headers });
  }
  actualizar_producto_admin(data: any, id: any, token: any): Observable<any> {
    if (data.portada) {
      const headers = new HttpHeaders({ 'Authorization': token });
      const fd = new FormData();
      fd.append('titulo', data.titulo); fd.append('stock', data.stock);
      fd.append('precio', data.precio); fd.append('descripcion', data.descripcion);
      fd.append('contenido', data.contenido); fd.append('categoria', data.categoria);
      fd.append('portada', data.portada);
      return this._http.put(this.url + 'actualizar_producto_admin/' + id, fd, { headers });
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
      return this._http.put(this.url + 'actualizar_producto_admin/' + id, data, { headers });
    }
  }
  eliminar_producto_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_producto_admin/' + id, { headers });
  }
  listar_inventario_producto_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'listar_inventario_producto_admin/' + id, { headers });
  }
  eliminar_inventario_producto_admin(id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_inventario_producto_admin/' + id, { headers });
  }
  registro_inventario_producto_admin(data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'registro_inventario_producto_admin', data, { headers });
  }
  actualizar_producto_variedades_admin(data: any, id: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_producto_variedades_admin/' + id, data, { headers });
  }
  agregar_imagen_galeria_admin(id: any, data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': token });
    const fd = new FormData();
    fd.append('_id', data._id); fd.append('imagen', data.imagen);
    return this._http.put(this.url + 'agregar_imagen_galeria_admin/' + id, fd, { headers });
  }
  eliminar_imagen_galeria_admin(id: any, data: any, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'eliminar_imagen_galeria_admin/' + id, data, { headers });
  }
  obtener_reviews_producto_publico(id: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_reviews_producto_publico/' + id, { headers });
  }
  actualizar_estado_envio(id: any, estado: string, token: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'cambiar_estado_envio/' + id, { estado }, { headers });
  }
}
