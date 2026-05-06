import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
import { GuestService } from 'src/app/services/guest.service';

declare var tns:any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit{

  public descuento_activo : any = undefined;
  public url : any;
  public new_producto : Array<any> = [];
  public producto_mas_vendidos : Array<any> = [];
  public categorias : Array<any> = [];

  constructor(    
    private _guestService: GuestService,
    private _clienteService: ClienteService,
  ){
    this.url = GLOBAL.url;
    
    this._clienteService.obtener_config_publico().subscribe( //linea 27
      response => {

        console.log(response)

        if (response && response.data && response.data.categorias) {
          response.data.categorias.forEach((element:any) => {
            if(element.titulo == 'Accesorios'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/1.jpg',
              });
            } else if(element.titulo == 'Accesorios Cascos'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/2.jpg',
              });
            } else if(element.titulo == 'Accesorios Motos'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/3.jpg',
              });
            } else if(element.titulo == 'Aceites'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/4.jpg',
              });
            } else if(element.titulo == 'Auto'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/5.jpg',
              });
            } else if(element.titulo == 'Bicicleta'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/6.jpg',
              });
            } else if(element.titulo == 'Cascos'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/7.jpg',
              });
            } else if(element.titulo == 'Guantes'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/8.jpg',
              });
            } else if(element.titulo == 'Herramienta'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/9.jpg',
              });
            } else if(element.titulo == 'Indumentaria Moto'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/10.jpg',
              });
            } else if(element.titulo == 'Indumentaria Persona'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/11.jpg',
              });
            } else if(element.titulo == 'Llantas'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/12.jpg',
              });
            } else if(element.titulo == 'Llaveros'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/13.jpg',
              });
            } else if(element.titulo == 'Luces'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/14.jpg',
              });
            } else if(element.titulo == 'Luces Led'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/15.jpg',
              });
            } else if(element.titulo == 'Parrilla'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/16.jpg',
              });
            } else if(element.titulo == 'Porta Celular'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/17.jpg',
              });
            } else if(element.titulo == 'Porta Placa'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/18.jpg',
              });
            } else if(element.titulo == 'Repuesto'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/19.jpg',
              });
            } else if(element.titulo == 'Seguridad'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/20.jpg',
              });
            } else if(element.titulo == 'Slider'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/21.jpg',
              });
            } else if(element.titulo == 'Souvenir'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/22.jpg',
              });
            } else if(element.titulo == 'Tubo De Escape'){
              this.categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/23.jpg',
              });
            }
          });
          console.log(this.categorias);

        } else {
          console.error('Response structure is not as expected.');
        }

      }
    )
  }

  ngOnInit(): void {

    setTimeout(()=>{
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true }
        }
      });

      tns({
        container: '.cs-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20
          },
          400: {
            items: 2,
            gutter: 20
          },
          520: {
            gutter: 30
          },
          768: {
            items: 3,
            gutter: 30
          }
        }
        
      });

      tns({
        container: '.cs-carousel-inner-three',
        controls: false,
        mouseDrag: !0,
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          420: {
            items: 2,
            gutter: 20
          },
          600: {
            items: 3,
            gutter: 20
          },
          700: {
            items: 3,
            gutter: 30
          },
          900: {
            items: 4,
            gutter: 30
          },
          1200: {
            items: 5,
            gutter: 30
          },
          1400: {
            items: 6,
            gutter: 30
          }
        }
        
        
      });

      tns({
        container: '.cs-carousel-inner-four',
        nav: false,
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        controlsContainer:'#custom-controls-trending',
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
        
      });

      tns({
        container: '.cs-carousel-inner-five',
        controls: false,
        gutter: 30,
        responsive: {
          0: { items: 1 },
          380: { items: 2 },
          550: { items: 3 },
          750: { items: 4 },
          1000: { items: 5 },
          1250: { items: 6 }
        }
        
      });

      tns({
        container: '.cs-carousel-inner-six',
        controls: false,
        gutter: 15,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          1200: { items: 3 }
        }
        
      });

    },500);

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

    this._guestService.listar_productos_nuevos_publico().subscribe(
      response => {
        //console.log(response); 
        this.new_producto = response.data;
      }
    );

    this._guestService.listar_productos_mas_vendidos_publico().subscribe(
      response => {
        //console.log(response); 
        this.producto_mas_vendidos = response.data;
      }
    );

  }
 
}
