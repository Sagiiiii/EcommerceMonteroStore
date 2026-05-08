import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import Chart from 'chart.js/auto';

// ════════════════════════════════════════════════════════════════
//  InicioComponent — Dashboard BI · MONTERO'S
//  Business Intelligence con KPIs, filtros y gráficos avanzados.
// ════════════════════════════════════════════════════════════════

interface KPIs {
  ventas_totales:      number;
  ventas_trend:        number;
  ganancia_neta:       number;
  ganancia_trend:      number;
  ticket_promedio:     number;
  clientes_activos:    number;
  clientes_nuevos:     number;
  clientes_recurrentes: number;
  ordenes_totales:     number;
  ordenes_trend:       number;
  stock_critico:       number;
  crecimiento_mensual: number;
}

interface AlmacenData {
  ventas:     number;
  ordenes:    number;
  stock:      number;
  porcentaje: number;
}

interface ProductoAlerta {
  nombre:  string;
  almacen: string;
  stock:   number;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {

  // ── Estado ────────────────────────────────────────────────────
  public load_data = false;
  public token = '';
  public rangoActivo  = '30d';
  public almacenActivo = 'todos';
  public ultimaActualizacion = '';

  // ── KPIs ──────────────────────────────────────────────────────
  public kpis: KPIs = {
    ventas_totales: 0, ventas_trend: 0,
    ganancia_neta: 0,  ganancia_trend: 0,
    ticket_promedio: 0,
    clientes_activos: 0, clientes_nuevos: 0, clientes_recurrentes: 72,
    ordenes_totales: 0, ordenes_trend: 0,
    stock_critico: 0, crecimiento_mensual: 0
  };

  // ── Almacenes ─────────────────────────────────────────────────
  public almacenes = {
    huancayo: { ventas: 0, ordenes: 0, stock: 0, porcentaje: 0 } as AlmacenData,
    ayacucho:  { ventas: 0, ordenes: 0, stock: 0, porcentaje: 0 } as AlmacenData
  };

  // ── Tabla alertas ─────────────────────────────────────────────
  public productosAlerta: ProductoAlerta[] = [];

  // ── Charts ────────────────────────────────────────────────────
  private charts: { [key: string]: any } = {
    mensuales: null, diarias: null, topProductos: null,
    clientes: null, gananciasCostos: null, stockAlmacen: null,
    retencion: null, sparkline: null
  };

  // ── Paleta dorada ─────────────────────────────────────────────
  private readonly GOLD_PALETTE = [
    '#c9a84c','#1e3a5f','#e0bb6a','#2d5986','#a8872e','#345f8a',
    '#f0d080','#4a7fa8','#8a6520','#5a98c0'
  ];

  private readonly MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token') ?? '';
  }

  ngOnInit(): void {
    this.ultimaActualizacion = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach(c => c?.destroy());
  }

  // ── Filtros ───────────────────────────────────────────────────
  setRango(rango: string): void {
    this.rangoActivo = rango;
    this.cargarDatos();
  }

  setAlmacen(almacen: string): void {
    this.almacenActivo = almacen;
    this.cargarDatos();
  }

  // ════════════════════════════════════════════════════════════════
  //  CARGA DE DATOS
  //  Conecta con los endpoints reales del AdminService.
  //  Los datos simulados sirven de fallback hasta tener la API.
  // ════════════════════════════════════════════════════════════════
  private cargarDatos(): void {
    this.cargarVentasMensuales();
    this.cargarVentasDiarias();
    this.cargarMejoresClientes();
    this.cargarMejoresItems();
    this.cargarDatosSimulados(); // fallback / complemento
  }

  private cargarVentasMensuales(): void {
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe({
      next: (r) => {
        this.kpis.ventas_totales   = r.total_ganancia      ?? 0;
        this.kpis.ganancia_neta    = r.total_ganancia_mes  ?? 0;
        this.kpis.ordenes_totales  = r.count_ventas_porcent ?? 0;
        this.kpis.ticket_promedio  = this.kpis.ordenes_totales > 0
          ? this.kpis.ventas_totales / this.kpis.ordenes_totales : 0;

        const datos_hyo = [r.enero,r.febrero,r.marzo,r.abril,r.mayo,r.junio,
                           r.julio,r.agosto,r.septiembre,r.octubre,r.noviembre,r.diciembre];
        // Simulamos Ayacucho como porcentaje del total
        const datos_aya = datos_hyo.map((v: number) => +(v * 0.62).toFixed(2));
        const totalHyo = datos_hyo.reduce((a: number, b: number) => a + b, 0);
        const totalAya = datos_aya.reduce((a: number, b: number) => a + b, 0);
        const grand = totalHyo + totalAya || 1;

        this.almacenes.huancayo.ventas = totalHyo;
        this.almacenes.ayacucho.ventas  = totalAya;
        this.almacenes.huancayo.porcentaje = Math.round(totalHyo / grand * 100);
        this.almacenes.ayacucho.porcentaje  = Math.round(totalAya / grand * 100);

        this.load_data = true;
        this.renderBarrasApiladas('chart-ventas-mensuales', 'mensuales',
          this.MESES_CORTOS, datos_hyo, datos_aya);
        this.renderSparkline(datos_hyo);
      },
      error: () => { this.cargarDatosSimulados(); }
    });
  }

  private cargarVentasDiarias(): void {
    this._adminService.kpi_ganancias_diaria_admin(this.token).subscribe({
      next: (r) => {
        const datos = [r.domingo,r.lunes,r.martes,r.miercoles,r.jueves,r.viernes,r.sabado];
        this.renderLinea('chart-ventas-diarias', 'diarias',
          ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'], datos);
      },
      error: () => {}
    });
  }

  private cargarMejoresClientes(): void {
    this._adminService.kpi_mejores_cliente(this.token, '', '').subscribe({
      next: (r) => {
        const cantidades = r.data.map((i: any) => i.cantidad);
        const nombres    = r.data.map((i: any) => i.cliente?.nombres ?? 'Desconocido');
        this.kpis.clientes_activos = r.data.length;
        this.renderDonut('chart-mejores-clientes', 'clientes', nombres, cantidades);
        this.renderDonut('chart-retencion', 'retencion',
          ['Recurrentes','Nuevos'],
          [this.kpis.clientes_recurrentes, 100 - this.kpis.clientes_recurrentes],
          ['#c9a84c', '#1e3a5f']);
      },
      error: () => {}
    });
  }

  private cargarMejoresItems(): void {
    this._adminService.kpi_mejores_items(this.token, '', '').subscribe({
      next: (r) => {
        const cantidades = r.data.slice(0,8).map((i: any) => i.cantidad);
        const nombres    = r.data.slice(0,8).map((i: any) =>
          (i.producto?.titulo ?? 'Sin nombre').substring(0, 22));
        this.renderBarrasHorizontales('chart-top-productos', 'topProductos', nombres, cantidades);
      },
      error: () => {}
    });
  }

  // ── Datos simulados (fallback y complemento) ──────────────────
  private cargarDatosSimulados(): void {
    // KPIs de tendencia
    this.kpis.ventas_trend       = 12.4;
    this.kpis.ganancia_trend     = 8.7;
    this.kpis.ordenes_trend      = 15.2;
    this.kpis.crecimiento_mensual = 12.4;
    this.kpis.clientes_nuevos    = 34;
    this.kpis.stock_critico      = 7;

    // Almacenes simulados si no vienen de API
    if (this.almacenes.huancayo.ventas === 0) {
      this.almacenes.huancayo = { ventas: 18450, ordenes: 142, stock: 312, porcentaje: 62 };
      this.almacenes.ayacucho  = { ventas: 11340, ordenes: 89,  stock: 198, porcentaje: 38 };
      this.kpis.ventas_totales   = 29790;
      this.kpis.ganancia_neta    = 8420;
      this.kpis.ordenes_totales  = 231;
      this.kpis.ticket_promedio  = 128.96;
      this.kpis.clientes_activos = 186;

      const mHyo = [2100,2400,2200,2800,3100,2900,3400,3200,2800,3600,3100,3850];
      const mAya = [1300,1480,1360,1730,1920,1800,2100,1980,1730,2230,1920,2380];
      this.renderBarrasApiladas('chart-ventas-mensuales','mensuales',this.MESES_CORTOS,mHyo,mAya);
      this.renderSparkline(mHyo);
    }

    // Ventas diarias simuladas
    const diasVentas = [520,840,760,930,1100,980,640];
    this.renderLinea('chart-ventas-diarias','diarias',
      ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'], diasVentas);

    // Top productos simulados
    const topNombres = ['Audífonos Pro X2','Cargador USB-C','Micrófono Studio','Cable HDMI 4K',
                        'Adaptador BT','Funda Premium','Hub USB 7P','Parlante Mini'];
    const topCant = [142,128,97,86,74,65,58,49];
    this.renderBarrasHorizontales('chart-top-productos','topProductos',topNombres,topCant);

    // Mejores clientes simulados
    const clienteNombres = ['Ana Torres','Luis Ríos','María Paz','Carlos V.','Rosa M.','Otros'];
    const clienteCant    = [4200, 3800, 3100, 2700, 2200, 8900];
    this.renderDonut('chart-mejores-clientes','clientes',clienteNombres,clienteCant);

    // Retención
    this.renderDonut('chart-retencion','retencion',
      ['Recurrentes','Nuevos'], [72, 28], ['#c9a84c','#1e3a5f']);

    // Ganancias vs Costos
    const ganancias = [4200,4800,4400,5600,6200,5800,6800,6400,5600,7200,6200,7700];
    const costos    = [2100,2400,2200,2800,3100,2900,3400,3200,2800,3600,3100,3850];
    this.renderAreaDoble('chart-ganancias-costos','gananciasCostos',
      this.MESES_CORTOS, ganancias, costos);

    // Stock por almacén
    const prodNames = ['Audífonos','Cargadores','Micrófonos','Cables','Adaptadores'];
    const stockHyo  = [45, 32, 18, 67, 29];
    const stockAya  = [28, 19, 11, 41, 17];
    this.renderBarrasApiladas('chart-stock-almacen','stockAlmacen',
      prodNames, stockHyo, stockAya, 'y');

    // Tabla alertas
    this.productosAlerta = [
      { nombre: 'Micrófono Studio Pro', almacen: 'Huancayo', stock: 2 },
      { nombre: 'Adaptador USB-C 3.0',  almacen: 'Ayacucho',  stock: 3 },
      { nombre: 'Cable HDMI 4K 2m',     almacen: 'Huancayo', stock: 4 },
      { nombre: 'Hub USB 7 Puertos',    almacen: 'Ayacucho',  stock: 1 },
      { nombre: 'Parlante Mini BT',     almacen: 'Huancayo', stock: 6 },
      { nombre: 'Funda Premium L',      almacen: 'Ayacucho',  stock: 5 },
      { nombre: 'Cargador Rápido 65W',  almacen: 'Huancayo', stock: 3 },
    ];
    this.kpis.stock_critico = this.productosAlerta.length;
    this.load_data = true;
  }

  // ════════════════════════════════════════════════════════════════
  //  RENDERERS Chart.js
  // ════════════════════════════════════════════════════════════════

  private getCtx(id: string): CanvasRenderingContext2D | null {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }

  private destroyChart(key: string): void {
    this.charts[key]?.destroy();
    this.charts[key] = null;
  }

  private renderBarrasApiladas(
    id: string, key: string, labels: string[],
    datos1: number[], datos2: number[], indexAxis: 'x'|'y' = 'x'
  ): void {
    this.destroyChart(key);
    const ctx = this.getCtx(id); if (!ctx) return;
    this.charts[key] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label:'Huancayo', data: datos1, backgroundColor:'rgba(201,168,76,.75)', borderColor:'#c9a84c', borderWidth:1, borderRadius:4 },
          { label:'Ayacucho',  data: datos2, backgroundColor:'rgba(30,58,95,.75)',   borderColor:'#1e3a5f', borderWidth:1, borderRadius:4 }
        ]
      },
      options: {
        indexAxis, responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { stacked: false, grid: { color:'rgba(0,0,0,.04)' }, ticks: { font: { size:11 } } },
          y: { stacked: false, beginAtZero: true, grid: { color:'rgba(0,0,0,.04)' }, ticks: { font: { size:11 } } }
        }
      }
    });
  }

  private renderLinea(
    id: string, key: string, labels: string[], datos: number[]
  ): void {
    this.destroyChart(key);
    const ctx = this.getCtx(id); if (!ctx) return;
    this.charts[key] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Ventas S/.', data: datos,
          borderColor: '#c9a84c', backgroundColor: 'rgba(201,168,76,.08)',
          borderWidth: 2.5, tension: 0.4, fill: true,
          pointBackgroundColor:'#c9a84c', pointRadius: 4, pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color:'rgba(0,0,0,.04)' }, ticks: { font:{ size:11 } } },
          y: { beginAtZero: true, grid:{ color:'rgba(0,0,0,.04)' }, ticks:{ font:{ size:11 } } }
        }
      }
    });
  }

  private renderBarrasHorizontales(
    id: string, key: string, labels: string[], datos: number[]
  ): void {
    this.destroyChart(key);
    const ctx = this.getCtx(id); if (!ctx) return;
    this.charts[key] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Unidades', data: datos,
          backgroundColor: labels.map((_,i) => i === 0 ? '#c9a84c' : 'rgba(201,168,76,.45)'),
          borderColor: '#c9a84c', borderWidth: 1, borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, grid:{ color:'rgba(0,0,0,.04)' }, ticks:{ font:{ size:11 } } },
          y: { grid:{ display:false }, ticks:{ font:{ size:11 } } }
        }
      }
    });
  }

  private renderDonut(
    id: string, key: string, labels: string[], datos: number[], colores?: string[]
  ): void {
    this.destroyChart(key);
    const ctx = this.getCtx(id); if (!ctx) return;
    const bg = colores ?? this.GOLD_PALETTE;
    this.charts[key] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: datos, backgroundColor: bg, borderWidth: 2, borderColor: '#fff' }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '62%',
        plugins: { legend: { position:'bottom', labels:{ font:{ size:11 }, boxWidth:10, padding:12 } } }
      }
    });
  }

  private renderAreaDoble(
    id: string, key: string, labels: string[], ganancias: number[], costos: number[]
  ): void {
    this.destroyChart(key);
    const ctx = this.getCtx(id); if (!ctx) return;
    this.charts[key] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label:'Ganancias', data:ganancias, borderColor:'#c9a84c', backgroundColor:'rgba(201,168,76,.12)', fill:true, tension:0.4, borderWidth:2.5, pointRadius:3 },
          { label:'Costos',    data:costos,    borderColor:'#1e3a5f', backgroundColor:'rgba(30,58,95,.08)',   fill:true, tension:0.4, borderWidth:2, pointRadius:3, borderDash:[5,3] as any }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position:'bottom', labels:{ font:{ size:11 }, boxWidth:10 } } },
        scales: {
          x: { grid:{ color:'rgba(0,0,0,.04)' }, ticks:{ font:{ size:11 } } },
          y: { beginAtZero:true, grid:{ color:'rgba(0,0,0,.04)' }, ticks:{ font:{ size:11 } } }
        }
      }
    });
  }

  private renderSparkline(datos: number[]): void {
    this.destroyChart('sparkline');
    const ctx = this.getCtx('chart-sparkline'); if (!ctx) return;
    this.charts['sparkline'] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.MESES_CORTOS,
        datasets: [{
          data: datos, borderColor:'#c9a84c',
          backgroundColor:'rgba(201,168,76,.1)',
          fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend:{ display:false }, tooltip:{ enabled:false } },
        scales: { x:{ display:false }, y:{ display:false } }
      }
    });
  }
}
