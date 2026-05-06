import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global";
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

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
  login_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'login_cliente/',data,{ headers: headers });
    //({'Content-Type':'application/json','Authorization':token});
  }

  // Método para listar clientes filtrados por un administrador
  registro_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'registro_cliente/',data,{ headers: headers });
    //({'Content-Type':'application/json','Authorization':token});
  }

  // Método para obtener un cliente por un administrador
   obtener_cliente_guest(id: any, token: any): Observable<any> {
     let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
     return this._http.get(this.url + 'obtener_cliente_guest/' + id, { headers: headers });
   } 

  actualizar_perfil_cliente_guest(id:any,data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url + 'actualizar_perfil_cliente_guest/'+id,data,{headers:headers});
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
        localStorage.clear();
        return false;     
      }
    } catch (error) {
      console.log('ERROR DECODING TOKEN');
      localStorage.removeItem('token');
      return false;
    }

    return true;
  } 

  obtener_config_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_config_publico', { headers: headers });
  }

  listar_productos_publico(filtro:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'listar_productos_publico/'+filtro, { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  agregar_carrito_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'agregar_carrito_cliente',data, { headers: headers });
  } 

  // Método para obtener un cliente por un administrador
  obtener_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_carrito_cliente/' + id, { headers: headers });
  } 

  // Método para obtener un cliente por un administrador
  eliminar_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'eliminar_carrito_cliente/' + id, { headers: headers });
  } 

  // Método para obtener un cliente por un administrador
  registro_direccion_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'registro_direccion_cliente',data, { headers: headers });
  }

  // Método para obtener un cliente por un administrador
  obtener_direccion_todos_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_direccion_todos_cliente/'+ id, { headers: headers });
  } 

  // Método para obtener un cliente por un administrador
  cambiar_direccion_principal_cliente(id: any, cliente: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.put(this.url + 'cambiar_direccion_principal_cliente/'+ id +'/'+ cliente,{data:true}, { headers: headers });
  } 

  // Método para obtener un cliente por un administrador
  obtener_direccion_principal_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_direccion_principal_cliente/'+ id, { headers: headers });
  } 

  registro_compra_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'registro_compra_cliente',data, { headers: headers });
  }

  get_token_culqi(data: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set('Authorization','Bearer pk_test_16550b141d5c1eab');
    return this._http.post('https://secure.culqi.com/v2/tokens',data, { headers: headers });
  }

  get_charge_culqi(data: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set('Authorization','Bearer sk_test_5f9e08160404e175');
    return this._http.post('https://api.culqi.com/v2/charges',data, { headers: headers });
  }



  enviar_correo_compra_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'enviar_correo_compra_cliente/'+id, { headers: headers });
  }

  validar_cupon_cliente(cupon: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'validar_cupon_cliente/'+cupon, { headers: headers });
  }

  obtener_ordenes_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_ordenes_cliente/'+id, { headers: headers });
  }

  obtener_ordenes_detalle_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_ordenes_detalle_cliente/'+id, { headers: headers });
  }

  emitir_review_producto_cliente(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'emitir_review_producto_cliente',data,{ headers: headers });
  }

  obtener_review_producto_cliente(id:any ): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener_review_producto_cliente/'+id, { headers: headers });
  }

  obtener_review_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_review_cliente/'+id,{ headers: headers });
  }

  actualizar_estado_envio(id: any, estado: string, token: any): Observable<any> {
    const data = { estado: estado }; // Crear el objeto de datos con el nuevo estado
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'cambiar_estado_envio/' + id, data, { headers: headers });
  }


  

}