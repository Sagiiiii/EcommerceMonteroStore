import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";
import { IndexClienteComponent } from "./components/clientes/index-cliente/index-cliente.component";
import { adminGuard } from "./guards/admin.guard";
import { CreateClienteComponent } from "./components/clientes/create-cliente/create-cliente.component";
import { EditClienteComponent } from "./components/clientes/edit-cliente/edit-cliente.component";
import { CreateProductoComponent } from "./components/productos/create-producto/create-producto.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { UpdateProductoComponent } from "./components/productos/update-producto/update-producto.component";
import { InventarioProductoComponent } from "./components/productos/inventario-producto/inventario-producto.component";
import { CreateCuponComponent } from "./components/cupones/create-cupon/create-cupon.component";
import { IndexCuponComponent } from "./components/cupones/index-cupon/index-cupon.component";
import { UpdateCuponComponent } from "./components/cupones/update-cupon/update-cupon.component";
//import { ConfigComponent } from "./components/config/config.component";
import { VariedadProductoComponent } from "./components/productos/variedad-producto/variedad-producto.component";
import { GaleriaProductoComponent } from "./components/productos/galeria-producto/galeria-producto.component";
import { IndexDescuentoComponent } from "./components/descuento/index-descuento/index-descuento.component";
import { CreateDescuentoComponent } from "./components/descuento/create-descuento/create-descuento.component";
import { EditDescuentoComponent } from "./components/descuento/edit-descuento/edit-descuento.component";
import { IndexContactoComponent } from "./components/contacto/index-contacto/index-contacto.component";
import { ReviewsProductoComponent } from "./components/productos/reviews-producto/reviews-producto.component";
import { IndexVentasComponent } from "./components/ventas/index-ventas/index-ventas.component";
import { DetalleVentasComponent } from "./components/ventas/detalle-ventas/detalle-ventas.component";
import { ConfiguracionComponent } from "./components/configuracion/configuracion.component";
import { RegistroComponent } from "./components/registro/registro.component";
import { PerfilComponent } from "./components/perfil/perfil.component";
import { Error404Component } from "./components/error404/error404.component";

// Definición de rutas
const appRoutes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // Ruta inicial redirige a "inicio"
  { path: 'inicio', component: InicioComponent, canActivate: [adminGuard] }, // Ruta para el componente "Inicio" con guardia de administrador
  { path: 'login', component: LoginComponent }, // Ruta para el componente "Login"
  { path: 'register', component: RegistroComponent }, // Ruta para el componente "Login"

  { path: 'error404', component: Error404Component },

  {
    path: 'panel',
    children: [
      { path: 'perfil', component: PerfilComponent, canActivate: [adminGuard] },

      { path: 'clientes', component: IndexClienteComponent, canActivate: [adminGuard] }, // Ruta para el componente "IndexCliente" con guardia de administrador
      { path: 'clientes/registro', component: CreateClienteComponent, canActivate: [adminGuard] }, // Ruta para el componente "CreateCliente" con guardia de administrador
      { path: 'clientes/:id', component: EditClienteComponent, canActivate: [adminGuard] }, // Ruta para el componente "EditCliente" con guardia de administrador

      { path: 'productos/registro', component: CreateProductoComponent, canActivate: [adminGuard] }, // Ruta para el componente "CreateProducto" con guardia de administrador
      { path: 'productos', component: IndexProductoComponent, canActivate: [adminGuard] }, // Ruta para el componente "IndexProducto" con guardia de administrador
      { path: 'productos/:id', component: UpdateProductoComponent, canActivate: [adminGuard] }, // Ruta para el componente "UpdateProducto" con guardia de administrador
      { path: 'productos/inventario/:id', component: InventarioProductoComponent, canActivate: [adminGuard] }, // Ruta para el componente "InventarioProducto" con guardia de administrador
      { path: 'productos/variedades/:id', component: VariedadProductoComponent, canActivate: [adminGuard] },
      { path: 'productos/galeria/:id', component: GaleriaProductoComponent, canActivate: [adminGuard] },
      { path: 'productos/reviews/:id', component: ReviewsProductoComponent, canActivate: [adminGuard] },

      { path: 'cupones/registro', component: CreateCuponComponent, canActivate: [adminGuard] },
      { path: 'cupones', component: IndexCuponComponent, canActivate: [adminGuard] },
      { path: 'cupones/:id', component: UpdateCuponComponent, canActivate: [adminGuard] },

      { path: 'configuracion', component: ConfiguracionComponent, canActivate: [adminGuard] },
      //{ path: 'configuraciones', component: ConfigComponent, canActivate: [adminGuard] },

      { path: 'contactos', component: IndexContactoComponent, canActivate: [adminGuard] },

      { path: 'descuentos', component: IndexDescuentoComponent, canActivate: [adminGuard] },
      { path: 'descuentos/registro', component: CreateDescuentoComponent, canActivate: [adminGuard] },
      { path: 'descuentos/:id', component: EditDescuentoComponent, canActivate: [adminGuard] },

      { path: 'ventas', component: IndexVentasComponent, canActivate: [adminGuard] },
      { path: 'ventas/:id', component: DetalleVentasComponent, canActivate: [adminGuard] },



    ]
  }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
