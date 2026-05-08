import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ConfigStateService } from 'src/app/services/config-state.service';
import { GLOBAL } from 'src/app/services/global';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  public token: string = '';
  public config: any = { categorias: [] };
  public url: string = '';
  private configId: string = '';

  // ── Logo principal ────────────────────────────────────────────
  public imgSelect: string | ArrayBuffer = 'assets/img/01.jpg';
  public file: File | undefined = undefined;

  // ── Nueva categoría ──────────────────────────────────────────
  public titulo_cat: string = '';
  public icono_file: File | undefined = undefined;
  public icono_preview: string = '';
  public subiendo_icono: boolean = false;

  private readonly TIPOS_IMAGEN: string[] = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
  private readonly MAX_SIZE: number = 4_000_000;

  constructor(
    private _adminService: AdminService,
    private _configState: ConfigStateService
  ) {
    this.token = localStorage.getItem('token') ?? '';
    this.url   = GLOBAL.url;
  }

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  actualizar(configForm: NgForm): void {
    if (!configForm.valid) {
      this.mostrarError('Complete correctamente todos los campos obligatorios.');
      return;
    }
    if (!this.configId) {
      this.mostrarError('No se pudo identificar la configuración. Recargue la página.');
      return;
    }

    const payload = {
      titulo:      configForm.value.titulo,
      serie:       configForm.value.serie,
      correlativo: configForm.value.correlativo,
      categorias:  this.config.categorias,
      logo:        this.file
    };

    this._adminService.actualiza_config_admin(this.configId, payload, this.token).subscribe({
      next: (response) => {
        this.mostrarExito('Configuración de MONTERO\'S actualizada correctamente.');
        // Propagar cambios al sidebar y pestaña del navegador
        const data = response?.data ?? {};
        this._configState.update({
          titulo: data.titulo || configForm.value.titulo,
          logo:   data.logo   || this.config.logo
        });
        if (data.logo) this.config.logo = data.logo;
      },
      error: (err) => {
        console.error('[ConfiguracionComponent] Error al actualizar:', err);
        this.mostrarError('Ocurrió un error al guardar los cambios. Intente nuevamente.');
      }
    });
  }

  // ── Icono de categoría ────────────────────────────────────────

  triggerIconoInput(): void {
    (document.getElementById('input-icono-file') as HTMLInputElement)?.click();
  }

  iconoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) { this.icono_file = undefined; this.icono_preview = ''; return; }
    const archivo = input.files[0];
    if (!this.TIPOS_IMAGEN.includes(archivo.type)) {
      this.mostrarError('El ícono debe ser una imagen válida (JPG, PNG, WEBP, SVG o GIF).');
      return;
    }
    if (archivo.size > this.MAX_SIZE) {
      this.mostrarError('La imagen del ícono no puede superar los 4 MB.');
      return;
    }
    this.icono_file = archivo;
    const reader = new FileReader();
    reader.onload = () => { this.icono_preview = reader.result as string; };
    reader.readAsDataURL(archivo);
  }

  agregar_cat(): void {
    const titulo = this.titulo_cat.trim();
    if (!titulo) { this.mostrarError('Debe ingresar el nombre de la categoría.'); return; }
    if (!this.icono_file) { this.mostrarError('Debe seleccionar una imagen de ícono para la categoría.'); return; }

    this.subiendo_icono = true;
    this._adminService.subir_icono_categoria(this.icono_file, this.token).subscribe({
      next: (response) => {
        this.config.categorias.push({
          titulo,
          icono:    response.data,
          tipo:     'imagen',
          _id:      uuidv4()
        });
        this.titulo_cat   = '';
        this.icono_file   = undefined;
        this.icono_preview = '';
        this.subiendo_icono = false;
        const input = document.getElementById('input-icono-file') as HTMLInputElement;
        if (input) input.value = '';
      },
      error: () => {
        this.mostrarError('Error al subir el ícono. Intente nuevamente.');
        this.subiendo_icono = false;
      }
    });
  }

  eliminar_categoria(indice: number): void {
    if (indice >= 0 && indice < this.config.categorias.length) {
      this.config.categorias.splice(indice, 1);
    }
  }

  iconoSrc(item: any): string {
    return this.url + 'obtener_icono_categoria/' + item.icono;
  }

  esImagen(item: any): boolean {
    return item.tipo === 'imagen' || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.icono || '');
  }

  // ── Logo principal ────────────────────────────────────────────

  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) { this.resetearImagen(); return; }
    const archivo = input.files[0];
    if (!this.TIPOS_IMAGEN.includes(archivo.type)) {
      this.resetearImagen();
      this.mostrarError('El archivo debe ser una imagen válida (JPG, PNG, WEBP o GIF).');
      return;
    }
    if (archivo.size > this.MAX_SIZE) {
      this.resetearImagen();
      this.mostrarError('La imagen no puede superar los 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { if (reader.result) this.imgSelect = reader.result; };
    reader.readAsDataURL(archivo);
    this.file = archivo;
  }

  // ── Privados ──────────────────────────────────────────────────

  private cargarConfiguracion(): void {
    this._adminService.obtener_config_admin(this.token).subscribe({
      next: (response) => {
        if (response?.data) {
          this.config   = response.data;
          this.configId = response.data._id ?? '';
          this.imgSelect = this.url + 'obtener_logo/' + this.config.logo;
        } else {
          this.imgSelect = 'assets/img/01.jpg';
        }
      },
      error: (err) => {
        console.error('[ConfiguracionComponent] Error al cargar configuración:', err);
        this.mostrarError('No se pudo cargar la configuración. Recargue la página.');
      }
    });
  }

  private resetearImagen(): void {
    this.imgSelect = 'assets/img/01.jpg';
    this.file = undefined;
  }

  private mostrarExito(mensaje: string): void {
    iziToast.show({ title: 'Actualizado', titleColor: '#1DC74C', theme: 'dark', class: 'text-success', position: 'topRight', message: mensaje });
  }

  private mostrarError(mensaje: string): void {
    iziToast.show({ title: 'Error', titleColor: '#FF3B30', theme: 'dark', class: 'text-danger', position: 'topRight', message: mensaje });
  }
}
