import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from "rxjs";
import { ClienteService } from "../services/cliente.service";

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {

  constructor(
    private _clienteService:ClienteService,
    private _router:Router,
  ){

  } 

  canActivate():any{
    if(!this._clienteService.isAuthenticate([])){
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
    
 }
