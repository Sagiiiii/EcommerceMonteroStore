import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GLOBAL } from './global';

export interface AdminProfile {
  nombres:   string;
  apellidos: string;
  foto:      string;
  ts?:       number;
}

@Injectable({ providedIn: 'root' })
export class AdminStateService {

  private readonly DEFAULT_AVATAR = 'assets/img/user.png';

  private _profile = new BehaviorSubject<AdminProfile>({
    nombres: '', apellidos: '', foto: ''
  });

  profile$ = this._profile.asObservable();

  update(profile: AdminProfile): void {
    this._profile.next({ ...profile, ts: Date.now() });
  }

  avatarUrl(foto: string, ts?: number): string {
    if (!foto) return this.DEFAULT_AVATAR;
    const bust = ts ? '?t=' + ts : '';
    return GLOBAL.url + 'obtener_foto_admin/' + foto + bust;
  }
}
