import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxTinymceModule } from 'ngx-tinymce';

import { AppRoutingModule }   from './app-routing.module';
import { AppComponent }       from './app.component';
import { routing }            from './app.routing';

// ── Componentes generales ─────────────────────────────────────
import { InicioComponent }    from './components/inicio/inicio.component';
import { SidebarComponent }   from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent }     from './components/login/login.component';
import { RegistroComponent }  from './components/registro/registro.component';
import { PerfilComponent }    from './components/perfil/perfil.component';
import { Error404Component }  from './components/error404/error404.component';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';

// ── Clientes ──────────────────────────────────────────────────
import { IndexClienteComponent }  from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent }   from './components/clientes/edit-cliente/edit-cliente.component';

// ── Productos ─────────────────────────────────────────────────
import { CreateProductoComponent }     from './components/productos/create-producto/create-producto.component';
import { IndexProductoComponent }      from './components/productos/index-producto/index-producto.component';
import { UpdateProductoComponent }     from './components/productos/update-producto/update-producto.component';
import { InventarioProductoComponent } from './components/productos/inventario-producto/inventario-producto.component';
import { VariedadProductoComponent }   from './components/productos/variedad-producto/variedad-producto.component';
import { GaleriaProductoComponent }    from './components/productos/galeria-producto/galeria-producto.component';
import { ReviewsProductoComponent }    from './components/productos/reviews-producto/reviews-producto.component';

// ── Cupones ───────────────────────────────────────────────────
import { CreateCuponComponent } from './components/cupones/create-cupon/create-cupon.component';
import { IndexCuponComponent }  from './components/cupones/index-cupon/index-cupon.component';
import { UpdateCuponComponent } from './components/cupones/update-cupon/update-cupon.component';

// ── Descuentos ────────────────────────────────────────────────
import { CreateDescuentoComponent } from './components/descuento/create-descuento/create-descuento.component';
import { EditDescuentoComponent }   from './components/descuento/edit-descuento/edit-descuento.component';
import { IndexDescuentoComponent }  from './components/descuento/index-descuento/index-descuento.component';

// ── Contacto ──────────────────────────────────────────────────
import { IndexContactoComponent } from './components/contacto/index-contacto/index-contacto.component';

// ── Ventas ────────────────────────────────────────────────────
import { IndexVentasComponent }   from './components/ventas/index-ventas/index-ventas.component';
import { DetalleVentasComponent } from './components/ventas/detalle-ventas/detalle-ventas.component';


// ════════════════════════════════════════════════════════════════
//  AppModule — Módulo raíz del Panel Administrativo MONTERO'S
// ════════════════════════════════════════════════════════════════

@NgModule({
  declarations: [
    AppComponent,

    // Generales
    InicioComponent,
    SidebarComponent,
    NavbarComponent,
    LoginComponent,
    RegistroComponent,
    PerfilComponent,
    Error404Component,
    ConfiguracionComponent,

    // Clientes
    IndexClienteComponent,
    CreateClienteComponent,
    EditClienteComponent,

    // Productos
    CreateProductoComponent,
    IndexProductoComponent,
    UpdateProductoComponent,
    InventarioProductoComponent,
    VariedadProductoComponent,
    GaleriaProductoComponent,
    ReviewsProductoComponent,

    // Cupones
    CreateCuponComponent,
    IndexCuponComponent,
    UpdateCuponComponent,

    // Descuentos
    CreateDescuentoComponent,
    EditDescuentoComponent,
    IndexDescuentoComponent,

    // Contacto
    IndexContactoComponent,

    // Ventas
    IndexVentasComponent,
    DetalleVentasComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbPaginationModule,
    NgxTinymceModule.forRoot({
      baseURL: '../../assets/tinymce/'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
