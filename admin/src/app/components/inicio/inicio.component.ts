import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import Chart from 'chart.js/auto';

// ════════════════════════════════════════════════════════════════
//  InicioComponent — Dashboard Principal
//  Panel Administrativo MONTERO'S · JAIME PONCE MONTERO
//
//  Muestra KPIs de ventas y gráficos estadísticos:
//  · Ganancias totales y mensuales
//  · Ventas mensuales (línea)
//  · Ventas diarias (barras)
//  · Mejores clientes (pastel)
//  · Mejores ítems (dona)
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {

  // ── KPIs ──────────────────────────────────────────────────────
  public total_ganancia:      number = 0;
  public total_ganancia_mes:  number = 0;
  public count_ventas_porcent: number = 0;
  public total_mes_anterior:  number = 0;
  public meses:               string = '';
  public mes_anterior:        string = '';

  // ── Estado de carga ───────────────────────────────────────────
  // true = datos cargados y disponibles para mostrar
  public load_data: boolean = false;

  // ── Autenticación ─────────────────────────────────────────────
  public token: string = '';

  // ── Instancias de gráficos (para destruir antes de recrear) ───
  private chartMensuales:  Chart | null = null;
  private chartDiarias:    Chart | null = null;
  private chartClientes:   Chart | null = null;
  private chartItems:      Chart | null = null;

  // ── Nombres de meses para conversión de número a texto ────────
  private readonly MESES: string[] = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // ── Nombres de días para conversión de número a texto ─────────
  private readonly DIAS: string[] = [
    '', 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  // ── Colores para Chart.js ─────────────────────────────────────
  private readonly COLORES_BG: string[] = [
    'rgba(59, 130, 246, 0.25)',
    'rgba(16, 185, 129, 0.25)',
    'rgba(245, 158, 11, 0.25)',
    'rgba(239, 68, 68, 0.25)',
    'rgba(139, 92, 246, 0.25)',
    'rgba(236, 72, 153, 0.25)',
    'rgba(20, 184, 166, 0.25)',
    'rgba(251, 146, 60, 0.25)',
  ];

  private readonly COLORES_BORDER: string[] = [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(20, 184, 166, 1)',
    'rgba(251, 146, 60, 1)',
  ];

  // ─────────────────────────────────────────────────────────────
  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token') ?? '';
  }

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy(): void {
    // Destruir todas las instancias de gráficos al salir
    this.chartMensuales?.destroy();
    this.chartDiarias?.destroy();
    this.chartClientes?.destroy();
    this.chartItems?.destroy();
  }

  // ══ MÉTODOS PÚBLICOS ══════════════════════════════════════════

  /** Recarga todos los KPIs y gráficos del dashboard. */
  initData(): void {
    this.cargarVentasMensuales();
    this.cargarVentasDiarias();
    this.cargarMejoresClientes();
    this.cargarMejoresItems();
  }

  // ══ MÉTODOS PRIVADOS — KPIs y gráficos ═══════════════════════

  /** Carga ganancias mensuales y renderiza el gráfico de líneas. */
  private cargarVentasMensuales(): void {
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe({
      next: (response) => {
        this.total_ganancia       = response.total_ganancia      ?? 0;
        this.total_ganancia_mes   = response.total_ganancia_mes  ?? 0;
        this.count_ventas_porcent = response.count_ventas_porcent ?? 0;
        this.total_mes_anterior   = response.total_mes_anterior  ?? 0;
        this.meses                = this.MESES[response.meses]        ?? '';
        this.mes_anterior         = this.MESES[response.mes_anterior] ?? '';
        this.load_data            = true;

        const datos = [
          response.enero,    response.febrero,   response.marzo,
          response.abril,    response.mayo,       response.junio,
          response.julio,    response.agosto,     response.septiembre,
          response.octubre,  response.noviembre,  response.diciembre
        ];

        this.renderizarGrafico(
          'chart-ventas-mensuales',
          'chartMensuales',
          'line',
          ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
          datos,
          'Ventas mensuales (S/.)',
          { tension: 0.4 }
        );
      },
      error: (err) => {
        console.error('[InicioComponent] Error al cargar ventas mensuales:', err);
      }
    });
  }

  /** Carga ventas por día de la semana y renderiza el gráfico de barras. */
  private cargarVentasDiarias(): void {
    this._adminService.kpi_ganancias_diaria_admin(this.token).subscribe({
      next: (response) => {
        // Corrección: usar response.dias (no response.meses) para el día actual
        this.load_data = true;

        const datos = [
          response.domingo,
          response.lunes,
          response.martes,
          response.miercoles,
          response.jueves,
          response.viernes,   // ← corregido: era response.sabado (bug original)
          response.sabado
        ];

        this.renderizarGrafico(
          'chart-ventas-diarias',
          'chartDiarias',
          'bar',
          ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
          datos,
          'Ventas por día (S/.)'
        );
      },
      error: (err) => {
        console.error('[InicioComponent] Error al cargar ventas diarias:', err);
      }
    });
  }

  /** Carga los mejores clientes y renderiza el gráfico de pastel. */
  private cargarMejoresClientes(): void {
    this._adminService.kpi_mejores_cliente(this.token, '', '').subscribe({
      next: (response) => {
        const cantidades = response.data.map((i: any) => i.cantidad);
        const nombres    = response.data.map((i: any) => i.cliente?.nombres ?? 'Desconocido');
        this.load_data   = true;

        this.renderizarGrafico(
          'chart-mejores-clientes',
          'chartClientes',
          'pie',
          nombres,
          cantidades,
          'Compras por cliente (S/.)'
        );
      },
      error: (err) => {
        console.error('[InicioComponent] Error al cargar mejores clientes:', err);
      }
    });
  }

  /** Carga los mejores ítems y renderiza el gráfico de dona. */
  private cargarMejoresItems(): void {
    this._adminService.kpi_mejores_items(this.token, '', '').subscribe({
      next: (response) => {
        const cantidades = response.data.map((i: any) => i.cantidad);
        const nombres    = response.data.map((i: any) => i.producto?.titulo ?? 'Sin nombre');
        this.load_data   = true;

        this.renderizarGrafico(
          'chart-mejores-items',
          'chartItems',
          'doughnut',
          nombres,
          cantidades,
          'Ventas por producto (S/.)'
        );
      },
      error: (err) => {
        console.error('[InicioComponent] Error al cargar mejores ítems:', err);
      }
    });
  }

  /**
   * Método genérico para renderizar cualquier gráfico Chart.js.
   * Destruye la instancia anterior si ya existe para evitar duplicados.
   *
   * @param canvasId      ID del elemento <canvas> en el DOM
   * @param chartRef      Nombre de la propiedad de instancia en esta clase
   * @param tipo          Tipo de gráfico: 'line' | 'bar' | 'pie' | 'doughnut'
   * @param labels        Etiquetas del eje X o segmentos
   * @param datos         Valores numéricos del dataset
   * @param labelDataset  Nombre del dataset (aparece en tooltip)
   * @param extraOptions  Opciones adicionales del dataset (ej: tension)
   */
  private renderizarGrafico(
    canvasId: string,
    chartRef: 'chartMensuales' | 'chartDiarias' | 'chartClientes' | 'chartItems',
    tipo: any,
    labels: string[],
    datos: number[],
    labelDataset: string,
    extraOptions: any = {}
  ): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`[InicioComponent] Canvas no encontrado: #${canvasId}`);
      return;
    }

    // Destruir instancia previa para evitar "Canvas is already in use"
    if (this[chartRef]) {
      this[chartRef]!.destroy();
      this[chartRef] = null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error(`[InicioComponent] No se pudo obtener contexto 2D de: #${canvasId}`);
      return;
    }

    this[chartRef] = new Chart(ctx, {
      type: tipo,
      data: {
        labels,
        datasets: [{
          label:           labelDataset,
          data:            datos,
          backgroundColor: this.COLORES_BG,
          borderColor:     this.COLORES_BORDER,
          borderWidth:     2,
          ...extraOptions
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title:  { display: false }
        },
        scales: tipo === 'pie' || tipo === 'doughnut' ? {} : {
          x: { display: true, grid: { display: false } },
          y: { display: true, beginAtZero: true, title: { display: true, text: 'S/.' } }
        }
      }
    });
  }
}
