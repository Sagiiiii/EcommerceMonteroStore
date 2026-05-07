// ════════════════════════════════════════════════════════════════
//  global.ts — Configuración global de la API · MONTERO'S
//  Panel Administrativo · JAIME PONCE MONTERO
//
//  ⚠️  IMPORTANTE — GESTIÓN DE ENTORNOS:
//  Para separar correctamente las URLs de desarrollo y producción,
//  se recomienda migrar esta configuración a los archivos de
//  entorno de Angular:
//
//  src/environments/environment.ts         → desarrollo (local)
//  src/environments/environment.prod.ts    → producción (Railway)
//
//  Ejemplo en environment.prod.ts:
//  export const environment = {
//    production: true,
//    apiUrl: 'https://eccommerceback-production-f0f6.up.railway.app/api/'
//  };
//
//  Y luego importar como:
//  import { environment } from 'src/environments/environment';
//  this.url = environment.apiUrl;
//
//  Mientras tanto, este archivo centraliza la URL activa.
//  Cambie el valor de `url` según el entorno en uso.
// ════════════════════════════════════════════════════════════════

export const GLOBAL: { url: string } = {
  // ── Desarrollo local ──────────────────────────────────────────
  url: 'http://localhost:3000/api/'

  // ── Producción (Railway) — descomentar al desplegar ───────────
  // url: 'https://eccommerceback-production-f0f6.up.railway.app/api/'
};
