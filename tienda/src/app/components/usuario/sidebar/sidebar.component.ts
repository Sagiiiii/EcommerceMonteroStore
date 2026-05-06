import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit{

  public token : any;
  public user : any = undefined;
  public user_lc : any = undefined;
  public id : any;

  constructor(
    private _clienteService: ClienteService,
    private _router:Router
  ){
    this.token = localStorage.getItem('token'); 
    this.id = localStorage.getItem('_id');   

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

  ngOnInit(): void {
     
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

}