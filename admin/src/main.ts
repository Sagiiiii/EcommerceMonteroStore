import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import '@angular/localize/init';

// ════════════════════════════════════════════════════════════════
//  Punto de entrada — Panel Administrativo MONTERO'S
// ════════════════════════════════════════════════════════════════

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
