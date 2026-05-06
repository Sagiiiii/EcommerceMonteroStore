import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { GLOBAL } from "./global";
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    // Inicializar la URL con el valor de la URL global
    this.url = GLOBAL.url;
  }

  // Método para iniciar sesión como administrador
  login_admin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_admin', data, { headers: headers });
  }

  // Método para registrar un admin por un administrador
  registro_admin(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'registro_admin', data, { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  obtener_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_admin/' + id, { headers: headers });
  }

  actualizar_perfil_admin(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'actualizar_perfil_admin/'+id,data,{headers:headers});
  }

  // Método para obtener el token de autenticación almacenado en el almacenamiento local
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para verificar la autenticación y los roles permitidos del usuario actual
  public isAuthenticate(allowRoles: string[]): boolean {
    const token: string | null = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);

      console.log(decodedToken);

      if(helper.isTokenExpired(token)){
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        console.log('ERROR DECODING TOKEN');
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      console.log('ERROR DECODING TOKEN');
      localStorage.removeItem('token');
      return false;
    }

    return allowRoles.includes(decodedToken['role']);
  }

  // Método para obtener un cliente por un administrador
  obtener_config_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_config_admin', { headers: headers });
  }

  // Método para actualizar un producto por un administrador
  actualiza_config_admin(id: any, data: any, token: any): Observable<any> {
    if (data.logo) {
      let headers = new HttpHeaders({'Authorization': token});
      const fd = new FormData();
      fd.append('titulo', data.titulo);
      fd.append('serie', data.serie);
      fd.append('correlativo', data.correlativo);
      fd.append('categorias', JSON.stringify(data.categorias));
      fd.append('logo', data.logo);
      return this._http.put(this.url + 'actualiza_config_admin/' + id, fd, { headers: headers });
    } else {
      let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
      return this._http.put(this.url + 'actualiza_config_admin/'+id, data, { headers: headers });
    }
  }

  obtener_config_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_publico', { headers: headers });
  }

  obtener_mensaje_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(this.url + 'obtener_mensaje_admin', { headers: headers });
  }

  cerrar_mensaje_admin(id: any,data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.put(this.url + 'cerrar_mensaje_admin/'+id,data, { headers: headers });
  }

  obtener_ventas_admin(desde: any, hasta: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(this.url + 'obtener_ventas_admin/'+desde+'/'+hasta, { headers: headers });
  }

  obtener_ordenes_detalle_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_ordenes_detalle_cliente/'+id, { headers: headers });
  }

  // KPI

  kpi_ganancias_mensuales_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'kpi_ganancias_mensuales_admin', { headers: headers });
  }

  kpi_mejores_cliente(token: any, fecha_ini: string, fecha_fin: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    let params = new HttpParams()
      .set('fecha_ini', fecha_ini)
      .set('fecha_fin', fecha_fin);
    return this._http.get(this.url + 'kpi_mejores_cliente', { headers: headers, params: params });
  }

  kpi_ganancias_diaria_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'kpi_ganancias_diaria_admin', { headers: headers });
  }

  kpi_mejores_items(token: any, fecha_ini: string, fecha_fin: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    let params = new HttpParams()
      .set('fecha_ini', fecha_ini)
      .set('fecha_fin', fecha_fin);
    return this._http.get(this.url + 'kpi_mejores_items', { headers: headers, params: params });
  }

}
