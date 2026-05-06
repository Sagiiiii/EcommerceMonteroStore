import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
//import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';

declare var noUiSlider : any;
declare var $:any;

declare var iziToast: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public config_global : any = {}; 
  public filter_categoria = '';
  public productos : Array<any> =[];
  public productos_const : Array<any> =[];
  public filter_cat_productos = 'todos';
  public filter_producto = '';
  public load_data = true;
  public url : any; 
  public route_categoria : any;

  public page = 1;
  public pageSize = 15;

  public sort_by = 'defecto';

  public carrito_data : any = {
    variedad: '',
    cantidad: 1
  };
  public btn_cart = false;
  public token : any; 

  public socket = io('http://localhost:4201');

  public descuento_activo : any = undefined;

  public producto : any = {};
  public count_five_start = 0;
  public count_four_start = 0;
  public count_three_start = 0;
  public count_two_start = 0;
  public count_one_start = 0;
  public cinco_porcent = 0;
  public cuatro_porcent = 0;
  public tres_porcent = 0;
  public dos_porcent = 0;
  public uno_porcent = 0;
  public total_puntos = 0;
  public max_puntos = 0;
  public porcent_raiting = 0;
  public puntos_raiting = 0;
  public reviews : Array<any> = [];
  public slug:any;
  public producto_rec : any = {};
  public producto_slug : any = {};

  constructor(
    private _clienteService:ClienteService,
    private _route: ActivatedRoute,
    private _router:Router,
    private _guestService: GuestService,
  ){
 
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._clienteService.obtener_config_publico().subscribe(
      response => {
        this.config_global = response.data;
      },
      error => {

      }
    )

    this._route.params.subscribe(
      params => {
        this.route_categoria = params['categoria'];
        //console.log(this.route_categoria);
        if(this.route_categoria){
          this._clienteService.listar_productos_publico('').subscribe(
            response => {
              //console.log('response', response);
              this.productos = response.data; 
              this.productos = this.productos.filter(item=>item.categoria.toLowerCase()==this.route_categoria); 
              this.load_data = false;       
            },
            error => {
      
            }
          )
        } else{
          this._clienteService.listar_productos_publico('').subscribe(
            response => {
              //console.log('response', response);
              this.productos = response.data; 
              this.load_data= false;   

              response.data.forEach((item: { slug: any, _id:any }) => {

                this._guestService.obtener_reviews_producto_publico(item._id).subscribe(
                  response => {
    
                    response.data.forEach((element:any)=>{
                      if(element.clasificacion == 5){
                          this.count_five_start = this.count_five_start + 1;
                          console.log('5 estrellas: ',this.count_five_start);        
                      } else if(element.clasificacion == 4){
                          this.count_four_start = this.count_four_start + 1;
                          console.log('4 estrellas: ',this.count_four_start); 
                      } else if(element.clasificacion == 3){
                          this.count_three_start = this.count_three_start + 1;
                          console.log('3 estrellas: ',this.count_three_start); 
                      } else if(element.clasificacion == 2){
                          this.count_two_start = this.count_two_start + 1;
                          console.log('2 estrellas: ',this.count_two_start); 
                      } else if(element.clasificacion == 1){
                          this.count_one_start = this.count_one_start + 1;
                          console.log('1 estrellas: ',this.count_one_start); 
                      }    
                         
                    }); 

                    this.puntos_raiting = this.count_one_start;
                    this.puntos_raiting = this.count_two_start;
                    this.puntos_raiting = this.count_three_start;
                    this.puntos_raiting = this.count_four_start;
                    this.puntos_raiting = this.count_five_start;

                    console.log(this.puntos_raiting);
    
                  }
                );

              });
              
              //console.log(this.slug);
              // this._guestService.obtener_productos_slug_publico(this.producto_rec.slug).subscribe(
              //   response => {
              //     //console.log(response);
              //     this.producto = response.data;

              //     this._guestService.obtener_reviews_producto_publico(this.producto._id).subscribe(
              //       response => {

              //         response.data.forEach((element:any)=>{
              //           if(element.clasificacion == 5){
              //               this.count_five_start = this.count_five_start + 1;
              //               console.log('5 estrellas: ',this.count_five_start);        
              //           } else if(element.estrellas == 4){
              //               this.count_four_start = this.count_four_start + 1;
              //               console.log('4 estrellas: ',this.count_four_start); 
              //           } else if(element.estrellas == 3){
              //               this.count_three_start = this.count_three_start + 1;
              //               console.log('3 estrellas: ',this.count_three_start); 
              //           } else if(element.estrellas == 2){
              //               this.count_two_start = this.count_two_start + 1;
              //               console.log('2 estrellas: ',this.count_two_start); 
              //           } else if(element.estrellas == 1){
              //               this.count_one_start = this.count_one_start + 1;
              //               console.log('1 estrellas: ',this.count_one_start); 
              //           } 

              //           this.cinco_porcent = (this.count_five_start*100)/response.data.length;
              //           this.cuatro_porcent = (this.count_four_start*100)/response.data.length;
              //           this.tres_porcent = (this.count_three_start*100)/response.data.length;
              //           this.dos_porcent = (this.count_two_start*100)/response.data.length;
              //           this.uno_porcent = (this.count_one_start*100)/response.data.length;

              //           let puntos_cinco = 0;
              //           let puntos_cuatro = 0;
              //           let puntos_tres = 0;
              //           let puntos_dos = 0;
              //           let puntos_uno = 0;

              //           puntos_cinco  = this.count_five_start    * 5;
              //           puntos_cuatro = this.count_four_start    * 4;
              //           puntos_tres   = this.count_three_start   * 3;
              //           puntos_dos    = this.count_two_start     * 2;
              //           puntos_uno    = this.count_one_start     * 1;

              //           this.total_puntos = puntos_cinco + puntos_cuatro + puntos_tres + puntos_dos + puntos_uno;
              //           this.max_puntos = response.data.length * 5;                  

              //           this.porcent_raiting = (this.total_puntos*100)/this.max_puntos;

              //           this.puntos_raiting = (this.porcent_raiting*5)/100;

              //           console.log('Estrellas: ',this.porcent_raiting); 

              //         }); 

              //         this.reviews = response.data;
              //         console.log(response);
              //       }
              //     );                  
              //   },
              //   error => {
              //     //console.log(error);
              //   }
              // )
              
            },
            error => {
      
            }
          )
        }   



         

      }
    )

  }

  ngOnInit(): void {
    var slider: any = document.querySelector('.cs-range-slider-ui'); 

    noUiSlider.create(slider, {
      start: [0, 1000],
      connect: true,
      range: {
        'min': 0,
        'max': 1000
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,
      }
    });

    slider.noUiSlider.on('update', function (values: any[]) {
      //console.log('Values', values)
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });

    $('.noUi-tooltip').css('font-size', '11px');

    this._guestService.obtener_descuento_activo().subscribe(
      response => {
        //console.log('banner',response)

        if(response.data != undefined){
          this.descuento_activo = response.data[0];
          //console.log('banner',this.descuento_activo);
        } else{
          this.descuento_activo = undefined;
        }
        
      }
    );

  }

  buscar_por_categoria(){
    //console.log(this.filter_categoria)
    if(this.filter_categoria){
      var search = new RegExp(this.filter_categoria, 'i');
      this.config_global.categorias = this.config_global.categorias.filter(
        (item: { titulo: string; }) => search.test(item.titulo) 
      );
    } else {
      this._clienteService.obtener_config_publico().subscribe(
        response => {
          this.config_global = response.data;
        },
        error => {
  
        }
      )
    }
  } 

  buscar_por_producto(){
    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      response => {
        //console.log('response', response);
        this.productos = response.data;        
        this.load_data= false;        
      },
      error => {

      }
    )
  } 

  buscar_precios(){

    this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
      response => {
        //console.log('response', response);
        this.productos = response.data;

        let min = parseInt($('.cs-range-slider-value-min').val());
        let max = parseInt($('.cs-range-slider-value-max').val());
    
        //console.log('min: ',min,'max: ',max)
    
        this.productos = this.productos.filter((item)=> {
          return item.precio >= min && item.precio <= max
        });

      },
      error => {

      }
    )   

  }

  buscar_radio_button_categoria(){
    //console.log(this.filter_cat_productos);
    if(this.filter_cat_productos == 'todos'){
      this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
        response => {
          //console.log('response', response);
          this.productos = response.data;
          this.load_data= false;        
        },
        error => {
  
        }
      )
    } else{
      this._clienteService.listar_productos_publico(this.filter_producto).subscribe(
        response => {
          //console.log('response', response);
          this.productos = response.data;
          this.productos = this.productos.filter(item=>item.categoria==this.filter_cat_productos); 
          this.load_data= false;     
        },
        error => {
  
        }
      )      
    }
  }

  reset_productos(){
    this.filter_producto = '';
    this._clienteService.listar_productos_publico('').subscribe(
      response => {
        //console.log('response', response);
        this.productos = response.data; 
        this.load_data= false;       
      },
      error => {

      }
    )
  }

  orden_por(){
    if(this.sort_by == 'defecto'){
      this._clienteService.listar_productos_publico('').subscribe(
        response => {
          //console.log('response', response);
          this.productos = response.data; 
          this.load_data= false;       
        },
        error => {
  
        }
      )
    } else if(this.sort_by == 'popularidad'){
      this.productos.sort(function (a:any, b:any){
        if(a.nventas < b.nventas){
          return 1;
        }
        if(a.nventas > b.nventas){
          return -1;
        }

        // a must be equal to b
        return 0;

      });
    } else if(this.sort_by == '+-precio'){
      this.productos.sort(function (a:any, b:any){
        if(a.precio < b.precio){
          return 1;
        }
        if(a.precio > b.precio){
          return -1;
        }

        // a must be equal to b
        return 0;

      });
    } else if(this.sort_by == '-+precio'){
      this.productos.sort(function (a:any, b:any){
        if(a.precio > b.precio){
          return 1;
        }
        if(a.precio < b.precio){
          return -1;
        }

        // a must be equal to b
        return 0;

      });
    } else if(this.sort_by == 'az'){
      this.productos.sort(function (a:any, b:any){
        if(a.titulo > b.titulo){
          return 1;
        }
        if(a.titulo < b.titulo){
          return -1;
        }

        // a must be equal to b
        return 0;

      });
    } else if(this.sort_by == 'za'){
      this.productos.sort(function (a:any, b:any){
        if(a.titulo < b.titulo){
          return 1;
        }
        if(a.titulo > b.titulo){
          return -1;
        }

        // a must be equal to b
        return 0;

      });
    }
  }

  agregar_producto(producto:any){

    //console.log('La cantidad es:', this.carrito_data.cantidad)

      let data = {
        producto: producto._id,
        cliente: localStorage.getItem('_id'),
        cantidad: 1,
        variedad: '',
      };

      // Verificar si el producto tiene variedades antes de acceder a la primera variedad
      if (producto.variedades && producto.variedades.length > 0) {
        data.variedad = producto.variedades[0].titulo;
      } else {
        // Si el producto no tiene variedades, asignar una variedad por defecto
        data.variedad = 'default';
      }

      //console.log(data);

      this.btn_cart =true;

      this._clienteService.agregar_carrito_cliente(data,this.token).subscribe(
        response => {
          //console.log('Respuesta Back: ',response)
          if(response.data == undefined){
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
            });
            this.btn_cart =false;
          } else{      
            //console.log(response);        
            iziToast.show({ 
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se agregó el producto al carrito.'
            });
            this.socket.emit('add-carrito-add',{data:true});
            this.btn_cart =false;
          }
        }
      )

  }

}