import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global";

@Injectable({
  providedIn: 'root'
})
export class CuponService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    // Inicializar la URL con el valor de la URL global
    this.url = GLOBAL.url;
  }

  // Método para registrar un cupon por un administrador
  registro_cupon_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'registro_cupon_admin', data, { headers: headers });
  }

  // Método para listar cupones por un administrador
  listar_cupones_filtro_admin(filtro: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'listar_cupones_filtro_admin/'+ filtro, { headers: headers });
  }

  // Método para obtener un cupon por un administrador
  obtener_cupon_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_cupon_admin/' + id, { headers: headers });
  }

  // Método para actualizar un cupon por un administrador
  actualizar_cupon_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.put(this.url + 'actualizar_cupon_admin/' + id, data, { headers: headers });
  }

  // Método para eliminar un cupon por un administrador
  eliminar_cupon_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'eliminar_cupon_admin/' + id, { headers: headers });
  }

}
