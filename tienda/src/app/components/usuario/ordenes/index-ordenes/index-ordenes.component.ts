import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';

declare var iziToast:any;

@Component({
  selector: 'app-index-ordenes',
  templateUrl: './index-ordenes.component.html',
  styleUrls: ['./index-ordenes.component.css']
})
export class IndexOrdenesComponent implements OnInit{

  public url : any;
  public token : any;
  public ordenes : Array<any> = [];
  public load_data = true;
  public user : any = {};

  public ventas_estado : any = {
    estado: '',
  };

  public page = 1;
  public pageSize = 15;
  
  public nuevoEstado : any = ''; 
  public mensaje_estado_envio : string = ''; 

  constructor(
    private _clienteService: ClienteService,
    private _guesService: GuestService
  ){
    this.token = localStorage.getItem('token');
  }  

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._clienteService.obtener_ordenes_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response => {
        console.log('orden:',response)
        this.ordenes = response.data;
        this.load_data = false;
      }
    );
  }

  cambiarEstado(idVenta: string, nuevoEstado: string) {
    this._guesService.actualizar_estado_envio(idVenta, nuevoEstado, this.token).subscribe(
      
      response => {      
        this.mensaje_estado_envio = response.message;
        
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: this.mensaje_estado_envio,
        });

        // Volver a cargar las ventas para reflejar el cambio de estado
        this.init_data();
    });
  }

}
