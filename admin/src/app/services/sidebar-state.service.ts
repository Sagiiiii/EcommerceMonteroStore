import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// ════════════════════════════════════════════════════════════════
//  SidebarStateService — MONTERO'S
//  Fuente única de verdad para el estado collapsed/expanded.
//  Persiste en localStorage para recordar la preferencia.
// ════════════════════════════════════════════════════════════════

@Injectable({ providedIn: 'root' })
export class SidebarStateService {

  private readonly STORAGE_KEY = 'monteros_sidebar_collapsed';

  // BehaviorSubject: emite el estado actual a cualquier suscriptor
  private _collapsed = new BehaviorSubject<boolean>(this.loadFromStorage());
  collapsed$ = this._collapsed.asObservable();

  get isCollapsed(): boolean {
    return this._collapsed.getValue();
  }

  toggle(): void {
    const next = !this.isCollapsed;
    this._collapsed.next(next);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next));
  }

  expand(): void {
    this._collapsed.next(false);
    localStorage.setItem(this.STORAGE_KEY, 'false');
  }

  collapse(): void {
    this._collapsed.next(true);
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  private loadFromStorage(): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  }
}
