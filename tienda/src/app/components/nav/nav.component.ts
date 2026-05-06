import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
//import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';

declare var iziToast: any;

declare var $:any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit{

  public token : any;
  public id : any;
  public user : any = undefined;
  public user_lc : any = undefined;
  public config_global : any = {};
  public productos : Array<any> =[];

  public op_cart : any = false;

  public carrito_arr : Array<any> = [];
  public url:any;

  public subtotal = 0;

  public socket = io('http://localhost:4201');

  public total_pagar = 0;

  public descuento_activo : any = undefined;

  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService,
    private _router:Router
  ){ 
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');   
    this.url = GLOBAL.url;

    this._clienteService.obtener_config_publico().subscribe(
      response => {
        this.config_global = response.data;
      },
      error => {

      }
    )

      if(this.token){
       this._clienteService.obtener_cliente_guest(this.id,this.token).subscribe(
         response => {
           //console.log(response);
           this.user = response.data;
           //console.log('User: ',this.user)
           localStorage.setItem('user_data',JSON.stringify(this.user));       
           const user_data_string = localStorage.getItem('user_data');      
           if(localStorage.getItem('user_data')){
            if(user_data_string !== null){
              this.user_lc = JSON.parse(user_data_string); 

              this.obtener_carrito();

            }         
          } else{
            this.user_lc = undefined; 
          }  
          //console.log('UserLC: ',this.user_lc)
         },
         error => {
           //console.log(error);
           this.user = undefined;
         }
       )
      }
  }

  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.user_lc._id, this.token).subscribe(
      response => {
        //console.log(response);
        this.carrito_arr = response.data;
        this.calcular_carrito();
      }
    );
  }

  ngOnInit(): void {    
    this.socket.on('new-carrito', (data) => {
      //console.log(data);
      this.obtener_carrito();
    });
    this.socket.on('new-carrito-add', (data) => {
      //console.log(data);
      this.obtener_carrito();
    });

    this._guestService.obtener_descuento_activo().subscribe( 
      response => {
        //console.log('banner',response)

        if(response.data != undefined){
          this.descuento_activo = response.data[0];
          console.log('banner',this.descuento_activo);
        } else{
          this.descuento_activo = undefined;
        }
        
      }
    );

  }  

  logout(){
    window.location.reload();
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('user_data');
    this._router.navigate(['/']).then(() => {
      window.location.reload();
    });;
  } 

  open_modalcart(){
    if(!this.op_cart){
      this.op_cart = true;
      $('#cart').addClass('show'); 
    } else{
      this.op_cart = false;
      $('#cart').removeClass('show');
    }
  }

  calcular_carrito(){
    this.subtotal = 0;
    if(this.descuento_activo == undefined){
      this.carrito_arr.forEach(element => {
        this.subtotal = this.subtotal + parseInt(element.producto.precio);
      });
    } else if(this.descuento_activo != undefined){
      this.carrito_arr.forEach(element => {
        let new_precio = Math.round(parseInt(element.producto.precio) - (parseInt(element.producto.precio)*this.descuento_activo.descuento)/100); 
        this.subtotal = this.subtotal + new_precio;
      });
    }    
    this.total_pagar = this.subtotal;
  }

  eliminar_item(id:any){
    this.total_pagar = 0;
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response => {
        //console.log(response);
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se elimino el producto correctamente.'
        });
        this.obtener_carrito();
        this.socket.emit('delete-carrito',{data:response.data});
      }
    );
  }

}