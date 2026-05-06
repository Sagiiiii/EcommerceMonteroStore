import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global";
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    // Inicializar la URL con el valor de la URL global
    this.url = GLOBAL.url;
  }

  // Método para registrar un producto por un administrador
  registro_producto_admin(data: any, file: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Authorization': token});
    const fd = new FormData();
    fd.append('titulo', data.titulo);
    fd.append('stock', data.stock);
    fd.append('precio', data.precio);
    fd.append('descripcion', data.descripcion);
    fd.append('contenido', data.contenido);
    fd.append('categoria', data.categoria);
    fd.append('portada', file);
    return this._http.post(this.url + 'registro_producto_admin', fd, { headers: headers });
  }

  // Método para listar productos por un administrador
  listar_productos_admin(filtro: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'listar_productos_admin/' + filtro, { headers: headers });
  }

  // Método para obtener un producto por un administrador
  obtener_producto_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'obtener_producto_admin/' + id, { headers: headers });
  }

  // Método para actualizar un producto por un administrador
  actualizar_producto_admin(data: any, id: any, token: any): Observable<any> {
    if (data.portada) {
      let headers = new HttpHeaders({'Authorization': token});
      const fd = new FormData();
      fd.append('titulo', data.titulo);
      fd.append('stock', data.stock);
      fd.append('precio', data.precio);
      fd.append('descripcion', data.descripcion);
      fd.append('contenido', data.contenido);
      fd.append('categoria', data.categoria);
      fd.append('portada', data.portada);
      return this._http.put(this.url + 'actualizar_producto_admin/' + id, fd, { headers: headers });
    } else {
      let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
      return this._http.put(this.url + 'actualizar_producto_admin/' + id, data, { headers: headers });
    }
  }

  // Método para eliminar un producto por un administrador
  eliminar_producto_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'eliminar_producto_admin/' + id, { headers: headers });
  }

  // Método para listar el inventario de un producto por un administrador
  listar_inventario_producto_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.get(this.url + 'listar_inventario_producto_admin/' + id, { headers: headers });
  }

  // Método para eliminar el inventario de un producto por un administrador
  eliminar_inventario_producto_admin(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.delete(this.url + 'eliminar_inventario_producto_admin/' + id, { headers: headers });
  }

  // Método para registrar el inventario de un producto por un administrador
  registro_inventario_producto_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.post(this.url + 'registro_inventario_producto_admin',data, { headers: headers });
  }

  // Método para actualizar un producto por un administrador
  actualizar_producto_variedades_admin(data: any, id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.put(this.url + 'actualizar_producto_variedades_admin/' + id, data, { headers: headers });
  }

  // Método para registrar un producto por un administrador
  agregar_imagen_galeria_admin(id:any, data:any, token:any): Observable<any> {
    let headers = new HttpHeaders({'Authorization': token});
    const fd = new FormData();
    fd.append('_id', data._id);
    fd.append('imagen', data.imagen);
    return this._http.put(this.url + 'agregar_imagen_galeria_admin/'+id,fd,{headers:headers});
  }

   // Método para actualizar un producto por un administrador
   eliminar_imagen_galeria_admin(id: any, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json', 'Authorization': token});
    return this._http.put(this.url + 'eliminar_imagen_galeria_admin/' + id, data, { headers: headers });
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
