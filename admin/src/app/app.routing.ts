import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { adminGuard } from './guards/admin.guard';

import { InicioComponent }              from './components/inicio/inicio.component';
import { LoginComponent }               from './components/login/login.component';
import { RegistroComponent }            from './components/registro/registro.component';
import { Error404Component }            from './components/error404/error404.component';
import { PerfilComponent }              from './components/perfil/perfil.component';

import { IndexClienteComponent }        from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent }       from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent }         from './components/clientes/edit-cliente/edit-cliente.component';

import { IndexProductoComponent }       from './components/productos/index-producto/index-producto.component';
import { CreateProductoComponent }      from './components/productos/create-producto/create-producto.component';
import { UpdateProductoComponent }      from './components/productos/update-producto/update-producto.component';
import { InventarioProductoComponent }  from './components/productos/inventario-producto/inventario-producto.component';
import { VariedadProductoComponent }    from './components/productos/variedad-producto/variedad-producto.component';
import { GaleriaProductoComponent }     from './components/productos/galeria-producto/galeria-producto.component';
import { ReviewsProductoComponent }     from './components/productos/reviews-producto/reviews-producto.component';

import { IndexCuponComponent }          from './components/cupones/index-cupon/index-cupon.component';
import { CreateCuponComponent }         from './components/cupones/create-cupon/create-cupon.component';
import { UpdateCuponComponent }         from './components/cupones/update-cupon/update-cupon.component';

import { IndexDescuentoComponent }      from './components/descuento/index-descuento/index-descuento.component';
import { CreateDescuentoComponent }     from './components/descuento/create-descuento/create-descuento.component';
import { EditDescuentoComponent }       from './components/descuento/edit-descuento/edit-descuento.component';

import { IndexContactoComponent }       from './components/contacto/index-contacto/index-contacto.component';

import { IndexVentasComponent }         from './components/ventas/index-ventas/index-ventas.component';
import { DetalleVentasComponent }       from './components/ventas/detalle-ventas/detalle-ventas.component';

import { ConfiguracionComponent }       from './components/configuracion/configuracion.component';

// ════════════════════════════════════════════════════════════════
//  Rutas del Panel Administrativo MONTERO'S
// ════════════════════════════════════════════════════════════════

const appRoutes: Routes = [
  { path: '',        redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio',  component: InicioComponent,   canActivate: [adminGuard] },
  { path: 'login',   component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'error404', component: Error404Component },

  {
    path: 'panel',
    children: [

      // Perfil
      { path: 'perfil', component: PerfilComponent, canActivate: [adminGuard] },

      // Clientes
      { path: 'clientes',           component: IndexClienteComponent,  canActivate: [adminGuard] },
      { path: 'clientes/registro',  component: CreateClienteComponent, canActivate: [adminGuard] },
      { path: 'clientes/:id',       component: EditClienteComponent,   canActivate: [adminGuard] },

      // Productos
      { path: 'productos/registro',         component: CreateProductoComponent,     canActivate: [adminGuard] },
      { path: 'productos',                  component: IndexProductoComponent,      canActivate: [adminGuard] },
      { path: 'productos/inventario/:id',   component: InventarioProductoComponent, canActivate: [adminGuard] },
      { path: 'productos/variedades/:id',   component: VariedadProductoComponent,   canActivate: [adminGuard] },
      { path: 'productos/galeria/:id',      component: GaleriaProductoComponent,    canActivate: [adminGuard] },
      { path: 'productos/reviews/:id',      component: ReviewsProductoComponent,    canActivate: [adminGuard] },
      { path: 'productos/:id',              component: UpdateProductoComponent,     canActivate: [adminGuard] },

      // Cupones
      { path: 'cupones/registro', component: CreateCuponComponent, canActivate: [adminGuard] },
      { path: 'cupones',          component: IndexCuponComponent,  canActivate: [adminGuard] },
      { path: 'cupones/:id',      component: UpdateCuponComponent, canActivate: [adminGuard] },

      // Descuentos
      { path: 'descuentos/registro', component: CreateDescuentoComponent, canActivate: [adminGuard] },
      { path: 'descuentos',          component: IndexDescuentoComponent,  canActivate: [adminGuard] },
      { path: 'descuentos/:id',      component: EditDescuentoComponent,   canActivate: [adminGuard] },

      // Contacto / Mensajes
      { path: 'contactos', component: IndexContactoComponent, canActivate: [adminGuard] },

      // Ventas
      { path: 'ventas',     component: IndexVentasComponent,   canActivate: [adminGuard] },
      { path: 'ventas/:id', component: DetalleVentasComponent, canActivate: [adminGuard] },

      // Configuración
      { path: 'configuracion', component: ConfiguracionComponent, canActivate: [adminGuard] },

    ]
  },

  // Wildcard — redirige cualquier ruta desconocida al 404
  { path: '**', component: Error404Component }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
