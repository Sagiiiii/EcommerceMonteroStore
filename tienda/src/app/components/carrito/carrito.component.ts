import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
//import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
import { Router } from '@angular/router';

declare var iziToast: any;
declare var Cleave: any;
declare var StickySidebar: any;
declare var paypal: any;

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
} 

//@ViewChild('paypalButton',{static:true}) paypalElement : ElementRef;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit{

  @ViewChild('paypalButton', { static: true })
  paypalElement!: ElementRef;

  public idCliente : any;
  public token : any;
  public carrito_arr : Array<any> = [];
  public url:any;
  public subtotal = 0;
  public total_pagar : any = 0;

  public socket = io('http://localhost:3000');
  public user_lc : any = undefined;

  public direccion_principal : any = {};
  public envios : Array<any> = [];
  public precio_envio = "0"; 

  public venta : any = {};
  public dventa : Array<any> = [];
  public card_data : any = {};
  public btn_load : any = false;
  public carrito_load : any = true;
  public user : any = {};

  public error_cupon = '';
  public descuento = 0;

  public descuento_activo : any = undefined;

  public selectedPaymentOption: string = 'cc';

  constructor(
    private _clienteService : ClienteService,
    private _guestService : GuestService,
    private _router : Router,
  ){
    const userData = localStorage.getItem('user_data');
    this.idCliente = localStorage.getItem('_id');
    this.venta.cliente = this.idCliente;
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._guestService.get_envios().subscribe(
      response => {
        //console.log(response);
        this.envios = response;
      }
    );

    if (userData !== null) {
      this.user = JSON.parse(userData);
    } else {
      // Manejar el caso en el que 'user_data' no existe en el almacenamiento local
    }
    
  }

  ngOnInit(): void {

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

    this.obtener_carrito();
    setTimeout(()=>{
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type:any) {
            // update UI ...
        }
      });
      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'Y']
      });
      var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });

    this.get_direccion_principal();

    paypal.Buttons({
      style: {
          layout: 'horizontal'
      },
      createOrder: (data:any,actions:any)=>{
  
          return actions.order.create({
            purchase_units : [{
              description : 'Pago en mi Ecommerce',
              amount : {
                currency_code : 'USD',
                value: this.subtotal
              },
            }]
          });
        
      },
      onApprove : async (data:any,actions:any)=>{
        const order = await actions.order.capture();
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.venta.cupon       = this.venta.cupon || '';
        this.venta.detalles    = this.dventa;
        this._clienteService.registro_compra_cliente(this.venta,this.token).subscribe(
          response=>{
            //console.log(response);
            this._clienteService.enviar_correo_compra_cliente(response.venta._id,this.token).subscribe(
              response => {
                this._router.navigate(['/']);
              },
              error=>{
                console.log(error);
              }
            );
          }
        );

      },
      onError : (err:any) =>{
       
      },
      onCancel: function (data:any,actions:any) {
        
      }
    }).render(this.paypalElement.nativeElement);

  }

  get_direccion_principal(){
    this._clienteService.obtener_direccion_principal_cliente(this.idCliente,this.token).subscribe(
      response => {
        //console.log('Direccion Principal: ',response);
        if(response.data == undefined){
          this.direccion_principal = undefined;
        } else{
          this.direccion_principal = response.data;
          this.venta.direccion = this.direccion_principal._id;
        }        

      }
    );
  }

  calcular_carrito(){
    this.subtotal = 0;
    if(this.descuento_activo == undefined){
      this.carrito_arr.forEach(element => {
        this.subtotal = this.subtotal + (parseInt(element.producto.precio) * element.cantidad);
      });
    } else {
      this.carrito_arr.forEach(element => {
        const precio_unitario = parseInt(element.producto.precio);
        const precio_con_descuento = Math.round(precio_unitario - (precio_unitario * this.descuento_activo.descuento) / 100);
        this.subtotal = this.subtotal + (precio_con_descuento * element.cantidad);
      });
    }
    this.total_pagar = this.subtotal;
  }

  obtener_carrito(){
    this._clienteService.obtener_carrito_cliente(this.idCliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data || [];
        this.dventa = [];

        this.carrito_arr.forEach(element => {
          const precio_unitario = parseInt(element.producto.precio);
          const precio_final = this.descuento_activo
            ? Math.round(precio_unitario - (precio_unitario * this.descuento_activo.descuento) / 100)
            : precio_unitario;

          this.dventa.push({
            producto: element.producto._id,
            subtotal: precio_final * element.cantidad,
            variedad: element.variedad,
            cantidad: element.cantidad,
            cliente:  localStorage.getItem('_id')
          });
        });

        this.carrito_load = false;
        this.calcular_carrito();

        const primer_envio = this.envios.length > 0 ? this.envios[0].titulo : 'Envío Gratis';
        this.calcular_total(primer_envio);
      }
    );
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

  calcular_total(envio_titulo:any){
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio); 
    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.precio_envio);
    this.venta.envio_titulo = envio_titulo;

    //console.log('This. venta: ', this.venta);

  }

  get_token_culqi(){

    let card_number = this.card_data.ncard.toString().replace(/ /g, "");
    let exp_arr = this.card_data.exp.toString().split('/');
    let expiration_month = exp_arr[0];
    let expiration_year = exp_arr[1].toString().slice(-2);
    //console.log('Fecha Exp Separada: ',exp_arr);

    let data = {
      "card_number": card_number,
      "cvv": this.card_data.cvc,
      "expiration_month": expiration_month,
      "expiration_year": expiration_year,
      "email": this.user.email,
    }

    console.log('Data Prepared Culqi: ',data)

    this.btn_load = true;

    this._clienteService.get_token_culqi(data).subscribe(
      response => {
        console.log('get_token_culqi: ',response);
        
        let charge = {
          amount: this.subtotal+'00',
          currency_code: 'PEN',
          email: this.user.email,
          source_id: response.id,
        }

        this._clienteService.get_charge_culqi(charge).subscribe(
          response => {
            console.log('get_charge_culqi Response: ',response)

            this.venta.transaccion = response.id;
            this.venta.cupon       = this.venta.cupon || '';
            this.venta.detalles    = this.dventa;

            this._clienteService.registro_compra_cliente(this.venta,this.token).subscribe(
              response=>{
                //console.log(response);
                this.btn_load = false;                
                this._clienteService.enviar_correo_compra_cliente(response.venta._id,this.token).subscribe(
                  response => {
                    this._router.navigate(['/']);
                  },
                  error=>{
                    console.log(error);
                  }
                );                  
              } 

            );           
          },

          error => {
            console.log('get_charge_culqi Error: ',error);
            this.btn_load = false;
          }
        );
        
      },
      error=>{
        console.log('get_token_culqi: ',error);
        this.btn_load = false;
      }
    );
  }

  pagar_cash() {
    this.btn_load = true;

    this.venta.metodoPago  = 'cash';
    this.venta.transaccion = this.venta.transaccion || ('CASH-' + Date.now());
    this.venta.cupon       = this.venta.cupon || '';
    this.venta.detalles    = this.dventa;

    this._clienteService.registro_compra_cliente(this.venta, this.token).subscribe(
      response => {
        this.btn_load = false;
        
        // Mostrar mensaje y redireccionar
        this._clienteService.enviar_correo_compra_cliente(response.venta._id, this.token).subscribe(
          response => {
            this._router.navigate(['/']);
          },
          error => {
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
        this.btn_load = false;
      }
    );
  }

  validar_cupon(){
    if(this.venta.cupon){
      if(this.venta.cupon.toString().length <= 25){
        // SI ES VALIDO
        this.error_cupon = '';
        this._clienteService.validar_cupon_cliente(this.venta.cupon, this.token).subscribe(
          response=> {
            //console.log(response);
            if(response.data != undefined){
              this.error_cupon = '';
              const tipo = (response.data.tipo || '').toLowerCase();
              if(tipo === 'valor fijo' || tipo === 'precio_fijo'){
                this.descuento = response.data.valor;
                this.total_pagar = this.total_pagar - this.descuento;
              } else if(tipo === 'porcentaje'){
                this.descuento = Math.round((this.total_pagar * response.data.valor) / 100);
                this.total_pagar = this.total_pagar - this.descuento;
              }
            } else{
              this.error_cupon = 'El cupón no se pudo canjear';
            }
          }
        );
      } else{
        // NO ES VALIDO
        this.error_cupon = 'El cupon debe tener menos de 25 caracteres';
      }
    } else{
      this.error_cupon = 'El cupon no es valido';
    }
  }

}
 