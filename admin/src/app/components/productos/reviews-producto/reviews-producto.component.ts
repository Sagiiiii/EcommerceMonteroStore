import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { ProductoService } from 'src/app/services/producto.service';

// ════════════════════════════════════════════════════════════════
//  ReviewsProductoComponent
//  Visualización de reseñas y calificaciones de un producto
//  del catálogo de MONTERO'S.
// ════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-reviews-producto',
  templateUrl: './reviews-producto.component.html',
  styleUrls: ['./reviews-producto.component.css']
})
export class ReviewsProductoComponent implements OnInit {

  // ── Modelos ───────────────────────────────────────────────────
  public producto: any          = {};
  public reviews:  Array<any>   = [];

  // ── Paginación ────────────────────────────────────────────────
  public page:     number = 1;
  public pageSize: number = 15;

  // ── Contexto ──────────────────────────────────────────────────
  public  url:   string = '';
  private id:    string = '';
  private token: string = '';

  // ─────────────────────────────────────────────────────────────
  constructor(
    private _route:           ActivatedRoute,
    private _productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.url   = GLOBAL.url;
    this.token = localStorage.getItem('token') ?? '';

    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.cargarProducto();
    });
  }

  // ══ MÉTODOS PRIVADOS ══════════════════════════════════════════

  private cargarProducto(): void {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe({
      next: (response) => {
        if (!response?.data) { this.producto = undefined; return; }
        this.producto = response.data;
        this.cargarReviews();
      },
      error: (err) => {
        console.error('[ReviewsProductoComponent] Error al cargar producto:', err);
        this.producto = undefined;
      }
    });
  }

  private cargarReviews(): void {
    this._productoService.obtener_reviews_producto_publico(this.producto._id).subscribe({
      next: (response) => {
        this.reviews = response?.data ?? [];
      },
      error: (err) => {
        console.error('[ReviewsProductoComponent] Error al cargar reseñas:', err);
        this.reviews = [];
      }
    });
  }
}
