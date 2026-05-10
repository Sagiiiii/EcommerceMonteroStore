import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GLOBAL } from './global';

export interface ConfigState {
  titulo: string;
  logo: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigStateService {

  private _config = new BehaviorSubject<ConfigState>({
    titulo: "MONTERO'S",
    logo: ''
  });

  config$ = this._config.asObservable();

  get current(): ConfigState {
    return this._config.getValue();
  }

  update(config: ConfigState): void {
    this._config.next(config);

    // Actualizar título de la pestaña del navegador
    document.title = config.titulo + ' · Panel Admin';

    // Actualizar favicon dinámicamente si hay logo
    if (config.logo) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = GLOBAL.url + 'obtener_logo/' + config.logo;
      }
    }
  }
}
