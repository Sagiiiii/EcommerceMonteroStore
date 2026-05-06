import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    // Inicializar la URL con el valor de la URL global
    this.url = GLOBAL.url;
  }

  // Método para listar clientes filtrados por un administrador
  listar_clientes_filtro_admin(tipo: any, filtro: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'listar_clientes_filtro_admin/' + tipo + '/' + filtro, { headers: headers });
  }

  // Método para registrar un cliente por un administrador
  registro_cliente_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'registro_cliente_admin', data, { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  obtener_cliente_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_cliente_admin/' + id, { headers: headers });
  }

  // Método para actualizar un cliente por un administrador
  actualizar_cliente_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.put(this.url + 'actualizar_cliente_admin/' + id, data, { headers: headers });
  }

  // Método para eliminar un cliente por un administrador
  eliminar_cliente_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'eliminar_cliente_admin/' + id, { headers: headers });
  }
}
