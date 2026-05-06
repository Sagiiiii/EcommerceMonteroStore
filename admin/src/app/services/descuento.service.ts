import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global";

@Injectable({
  providedIn: 'root'
})
export class DescuentoService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    // Inicializar la URL con el valor de la URL global
    this.url = GLOBAL.url;
  }

  // Método para registrar un producto por un administrador
  registro_descuento_admin(data: any, file: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Authorization': token});
    const fd = new FormData();
    fd.append('titulo', data.titulo);
    fd.append('descuento', data.descuento);
    fd.append('fecha_inicio', data.fecha_inicio);
    fd.append('fecha_fin', data.fecha_fin);
    fd.append('banner', file);
    return this._http.post(this.url + 'registro_descuento_admin', fd, { headers: headers });
  }

  // Método para listar productos por un administrador
  listar_descuento_admin(filtro: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'listar_descuento_admin/' + filtro, { headers: headers });
  }

  // Método para eliminar un producto por un administrador
  eliminar_descuento_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'eliminar_descuento_admin/' + id, { headers: headers });
  }

  // Método para obtener un producto por un administrador
  obtener_descuento_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_descuento_admin/' + id, { headers: headers });
  }

  // Método para actualizar un producto por un administrador
  actualizar_descuento_admin(data: any, id: any, token: any): Observable<any> {
    if (data.banner) {
      let headers = new HttpHeaders({'Authorization': token});
      const fd = new FormData();
      fd.append('titulo', data.titulo);
      fd.append('descuento', data.descuento);
      fd.append('fecha_inicio', data.fecha_inicio);
      fd.append('fecha_fin', data.fecha_fin);
      fd.append('banner', data.banner);
      return this._http.put(this.url + 'actualizar_descuento_admin/' + id, fd, { headers: headers });
    } else {
      let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
      return this._http.put(this.url + 'actualizar_descuento_admin/' + id, data, { headers: headers });
    }
  }

}
