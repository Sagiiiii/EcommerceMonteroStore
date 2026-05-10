import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public user : any = {};
  public user_register : any = {};
  public usuario : any = {};

  public token : any;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ){
    this.token = localStorage.getItem('token');

    if(this.token){
      this._router.navigate(['/']);
    }

  }

  ngOnInit(): void {

  }

  login(loginForm: any) {
    if (loginForm.valid) {

      let data = {
        email: this.user.email,
        password: this.user.password,
      }

      this._clienteService.login_cliente(data).subscribe(
        response => {
          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#ff0000',
              theme: 'dark',
              class: 'text-danger',
              position: 'topRight',
              message: response.message,
            });
          } else {
            this.usuario = response.data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('_id', response.data._id);

            this._clienteService.obtener_cliente_guest(response.data._id, response.token).subscribe(
              response => {
                //console.log(response);

              },
              error => {
                //console.log(error);
              }
            )

            this._router.navigate(['/']);
          }
        },
        error => {
          //console.log(error);
        }
      );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
    }
  }

  register(registerForm: any) {
    if (registerForm.valid) {

      let data = {
        nombres: this.user_register.nombres,
        apellidos: this.user_register.apellidos,
        email: this.user_register.email,
        password: this.user_register.password,
      }

      this._clienteService.registro_cliente(data).subscribe(
        response => {
          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#ff0000',
              theme: 'dark',
              class: 'text-danger',
              position: 'topRight',
              message: response.message,
            });
          } else {
            this.usuario = response.data;
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              theme: 'dark',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registró correctamente el cliente',
            });
            this._router.navigate(['/login']);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#ff0000',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
    }
  }

}
