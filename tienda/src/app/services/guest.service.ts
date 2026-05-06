import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global";
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;
 
  constructor(
    private _http: HttpClient,
  ) { 
    // Inicializar la URL con el valor de la URL global
    this.url = GLOBAL.url;
  }

  // Método para obtener un cliente por un administrador
  obtener_productos_slug_publico(slug: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'obtener_productos_slug_publico/' + slug, { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  listar_productos_recomendados_publico(categoria: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'listar_productos_recomendados_publico/' + categoria, { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  get_regiones(): Observable<any> {
    return this._http.get('./assets/regiones.json');
  }

  // Método para obtener un cliente por un administrador
  get_distritos(): Observable<any> {
    return this._http.get('./assets/distritos.json');
  }

  // Método para obtener un cliente por un administrador
  get_provincias(): Observable<any> {
    return this._http.get('./assets/provincias.json');
  }

  // Método para obtener un cliente por un administrador
  get_envios(): Observable<any> {
    return this._http.get('./assets/envios.json');
  }

  // Método para obtener un cliente por un administrador
  obtener_descuento_activo(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'obtener_descuento_activo', { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  listar_productos_nuevos_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'listar_productos_nuevos_publico', { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  listar_productos_mas_vendidos_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'listar_productos_mas_vendidos_publico', { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  enviar_mensaje_contacto(data:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'enviar_mensaje_contacto',data, { headers: headers });
  }

  obtener_reviews_producto_publico(id:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_reviews_producto_publico/'+id, { headers: headers });
  }

  actualizar_estado_envio(id: any, estado: string, token: any): Observable<any> {
    const data = { estado: estado }; // Crear el objeto de datos con el nuevo estado
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'cambiar_estado_envio/' + id, data, { headers: headers });
  }

}
