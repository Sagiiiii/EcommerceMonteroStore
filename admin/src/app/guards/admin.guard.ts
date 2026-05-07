import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

// ════════════════════════════════════════════════════════════════
//  AdminGuard — Guard de autenticación MONTERO'S
//  Protege las rutas del panel verificando que el token JWT
//  sea válido y que el rol del usuario sea 'admin'.
//  Se exporta también como 'adminGuard' para compatibilidad
//  con app.routing.ts sin necesidad de modificarlo.
// ════════════════════════════════════════════════════════════════

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) { }

  canActivate(): boolean {
    if (!this._adminService.isAuthenticate(['admin'])) {
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

// Alias camelCase para compatibilidad con app.routing.ts existente
export { AdminGuard as adminGuard };
