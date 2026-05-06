import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/global';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;

// ════════════════════════════════════════════════════════════════
//  ConfiguracionComponent
//  Gestión de la configuración general del sistema MONTERO'S.
//  Permite administrar nombre comercial, series de facturación,
//  categorías de productos y logotipo institucional.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, OnChanges {

  // ── Autenticación ──────────────────────────────────────────────
  public token: string = '';

  // ── Configuración general del sistema ─────────────────────────
  public config: any = { categorias: [] };

  // ── Campos auxiliares para nueva categoría ────────────────────
  public titulo_cat: string = '';
  public icono_cat: string = '';

  // ── Manejo de imagen / logo ───────────────────────────────────
  public imgSelect: string | ArrayBuffer = 'assets/img/01.jpg';
  public file: File | undefined = undefined;

  // ── URL base de la API ────────────────────────────────────────
  public url: string = '';

  // ── ID de configuración (debe ser dinámico, no hardcodeado) ───
  // NOTA: Se obtiene desde la respuesta del servidor.
  // Si el backend no lo devuelve en `response.data._id`, revisar endpoint.
  private configId: string = '';

  // ── Tipos de imagen permitidos ────────────────────────────────
  private readonly TIPOS_IMAGEN_PERMITIDOS: string[] = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif'
  ];

  // ── Tamaño máximo de imagen: 4 MB ────────────────────────────
  private readonly TAMANO_MAXIMO_IMAGEN: number = 4_000_000;

  // ─────────────────────────────────────────────────────────────
  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token') ?? '';
    this.url = GLOBAL.url;
  }

  // ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  ngOnChanges(): void {
    // Reservado para futuros bindings de @Input()
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /**
   * Guarda los cambios de configuración en el servidor.
   * Requiere que el formulario sea válido.
   */
  actualizar(configForm: NgForm): void {
    if (!configForm.valid) {
      this.mostrarError('Por favor, complete correctamente todos los campos obligatorios.');
      return;
    }

    if (!this.configId) {
      this.mostrarError('No se pudo identificar la configuración. Recargue la página e intente nuevamente.');
      return;
    }

    const payload = {
      titulo:       configForm.value.titulo,
      serie:        configForm.value.serie,
      correlativo:  configForm.value.correlativo,
      categorias:   this.config.categorias,
      logo:         this.file
    };

    this._adminService.actualiza_config_admin(this.configId, payload, this.token).subscribe({
      next: (_response) => {
        this.mostrarExito('La configuración de MONTERO\'S se actualizó correctamente.');
      },
      error: (err) => {
        console.error('[ConfiguracionComponent] Error al actualizar configuración:', err);
        this.mostrarError('Ocurrió un error al guardar los cambios. Intente nuevamente.');
      }
    });
  }

  /**
   * Agrega una nueva categoría a la lista.
   * Requiere título e ícono válidos.
   */
  agregar_cat(): void {
    const titulo = this.titulo_cat.trim();
    const icono  = this.icono_cat.trim();

    if (!titulo || !icono) {
      this.mostrarError('Debe ingresar un nombre y un ícono para la categoría.');
      return;
    }

    this.config.categorias.push({
      titulo,
      icono,
      _id: uuidv4()
    });

    this.titulo_cat = '';
    this.icono_cat  = '';
  }

  /**
   * Elimina la categoría en la posición indicada.
   */
  eliminar_categoria(indice: number): void {
    if (indice >= 0 && indice < this.config.categorias.length) {
      this.config.categorias.splice(indice, 1);
    }
  }

  /**
   * Maneja el cambio de archivo para el logotipo.
   * Valida tipo y tamaño antes de aceptar la imagen.
   */
  fileChangeEvent(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files[0]) {
      this.resetearImagen();
      this.mostrarError('No se seleccionó ninguna imagen.');
      return;
    }

    const archivo = input.files[0];

    if (!this.TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      this.resetearImagen();
      this.mostrarError('El archivo debe ser una imagen válida (JPG, PNG, WEBP o GIF).');
      return;
    }

    if (archivo.size > this.TAMANO_MAXIMO_IMAGEN) {
      this.resetearImagen();
      this.mostrarError('La imagen no puede superar los 4 MB.');
      return;
    }

    // Lectura y previsualización
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        this.imgSelect = reader.result;
      }
    };
    reader.readAsDataURL(archivo);
    this.file = archivo;
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  /**
   * Carga la configuración actual desde el servidor.
   */
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
        this.mostrarError('No se pudo cargar la configuración. Intente recargar la página.');
      }
    });
  }

  /**
   * Restablece la imagen seleccionada al valor por defecto.
   */
  private resetearImagen(): void {
    this.imgSelect = 'assets/img/01.jpg';
    this.file = undefined;
  }

  /**
   * Muestra una notificación de éxito con iziToast.
   */
  private mostrarExito(mensaje: string): void {
    iziToast.show({
      title: 'Actualizado',
      titleColor: '#1DC74C',
      theme: 'dark',
      class: 'text-success',
      position: 'topRight',
      message: mensaje
    });
  }

  /**
   * Muestra una notificación de error con iziToast.
   */
  private mostrarError(mensaje: string): void {
    iziToast.show({
      title: 'Error',
      titleColor: '#FF3B30',
      theme: 'dark',
      class: 'text-danger',
      position: 'topRight',
      message: mensaje
    });
  }
}
