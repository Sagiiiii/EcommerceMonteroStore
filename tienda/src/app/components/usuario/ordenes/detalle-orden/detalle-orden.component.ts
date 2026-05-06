import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/global';
import { StarRatingComponent } from 'ng-starrating';
import iziToast from 'izitoast';

declare var $ : any;

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit{

  public url : any;
  public token : any;
  public id : any;
  public detalles : Array<any> = [];
  public load_data = true;
  public orden : any = {};

  public review : any = {
    clasificacion: '',
  };
  public clasificacion : any;

  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute
  ){
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.init_data();
      }
    );
  }  

  ngOnInit(): void {
  }

  init_data(){
    this._clienteService.obtener_ordenes_detalle_cliente(this.id,this.token).subscribe(
      response => {
        console.log('detalle de orden:',response)
        if(response.data != undefined){
          this.orden = response.data;
          response.detalles.forEach((element:any) => {
            this._clienteService.obtener_review_producto_cliente(element.producto._id).subscribe(
              response => {
                //console.log('response reseña',response);
                let emitido = false;
                response.data.forEach((element_:any) => {
                  if(element_.cliente == localStorage.getItem('_id')){
                    emitido = true;
                  }
                });

                element.estado = emitido;

              }
            );
          });
          this.detalles = response.detalles;
          this.load_data = false;
        } else{
          this.orden = undefined;
        }

        //console.log(this.detalles);
        
      }
    );
  }

  openModal(item : any){
    this.review = {};
    this.review.producto = item.producto._id;
    this.review.cliente = item.cliente;
    this.review.venta = item._id;
    console.log(this.review);    
  }

  onRate($event:{oldValue:number, newValue:number, starRating:StarRatingComponent}) {
    console.log($event.newValue);
  }

  select_clasi(){

    if(this.review.clasificacion == '1_estrella'){
      //console.log('1');
      this.clasificacion = 1;
    } else if(this.review.clasificacion == '2_estrella'){      
      //console.log('2');
      this.clasificacion = 2;
    } else if(this.review.clasificacion == '3_estrella'){      
      //console.log('3');
      this.clasificacion = 3;
    } else if(this.review.clasificacion == '4_estrella'){      
      //console.log('4');
      this.clasificacion = 4;
    } else if(this.review.clasificacion == '5_estrella'){      
      //console.log('5');
      this.clasificacion = 5;
    } else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Numero de estrellas invalido'
      });
    }

  }

  emitir(id:any){
    if(this.review.review){

      if(this.clasificacion && this.clasificacion >= 0){
        this.review.clasificacion = this.clasificacion;
        //console.log('review',this.review);
        this._clienteService.emitir_review_producto_cliente(this.review, this.token).subscribe(
          response => {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              theme: 'dark',
              class: 'text-success',
              position: 'topRight',
              message: 'Se emitio correctamente la reseña',
            }); 
            $('#review-'+id).modal('hide');
            $('.modal-backdrop').removeClass('show');
            this.init_data();
          }
        );
      } else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#ff0000',
          theme: 'dark',
          class: 'text-danger',
          position: 'topRight',
          message: 'Selecciene el numero de estrellas'
        });
      }

    } else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un mensaje de la reseña'
      });
    }
  }


}
