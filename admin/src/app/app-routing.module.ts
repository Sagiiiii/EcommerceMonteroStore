import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ════════════════════════════════════════════════════════════════
//  AppRoutingModule — MONTERO'S · Panel Administrativo
//  Las rutas del panel están definidas en app.routing.ts
//  y se registran en AppModule mediante RouterModule.forRoot().
//  Este módulo queda vacío intencionalmente para evitar
//  conflicto de rutas duplicadas.
// ════════════════════════════════════════════════════════════════

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
