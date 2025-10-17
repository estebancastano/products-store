// src/app/features/products/product-detail.ts

import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ProductsService } from '../../core/services/products.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, Review } from '../../core/models/product.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';

interface ProductDetailState {
  product: Product | null;
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detail-container">
      <ng-container *ngIf="state$ | async as state">
        <div class="loading-container" *ngIf="state.loading">
          <mat-spinner></mat-spinner>
          <p>Cargando producto...</p>
        </div>

        <div class="error-container" *ngIf="state.error && !state.loading">
          <mat-icon color="warn">error</mat-icon>
          <p>{{ state.error }}</p>
          <button mat-raised-button color="primary" routerLink="/products">
            Volver al catálogo
          </button>
        </div>

        <div class="product-detail" *ngIf="state.product && !state.loading && !state.error">
          <div class="back-button">
            <button mat-button routerLink="/products">
              <mat-icon>arrow_back</mat-icon>
              Volver al catálogo
            </button>
          </div>

          <div class="product-content">
            <div class="product-gallery">
              <img [src]="currentImage()" [alt]="state.product.title" class="main-image">
              <div class="thumbnail-list">
                <img 
                  *ngFor="let image of state.product.images"
                  [src]="image"
                  [alt]="state.product.title"
                  class="thumbnail"
                  [class.active]="currentImage() === image"
                  (click)="currentImage.set(image)">
              </div>
            </div>

            <div class="product-info">
              <div class="product-header">
                <div>
                  <h1>{{ state.product.title }}</h1>
                  <p class="brand">{{ state.product.brand }}</p>
                </div>
                <div class="rating-box">
                  <mat-icon>star</mat-icon>
                  <span>{{ state.product.rating }}</span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="price-section">
                <span class="price">\${{ state.product.price }}</span>
                <mat-chip *ngIf="state.product.discountPercentage > 0" class="discount-chip">
                  -{{ state.product.discountPercentage }}%
                </mat-chip>
              </div>

              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Categoría:</span>
                  <span class="value">{{ state.product.category }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Stock:</span>
                  <span class="value" [class.low-stock]="state.product.stock < 10">
                    {{ state.product.stock }} unidades
                  </span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="description">
                <h3>Descripción</h3>
                <p>{{ state.product.description }}</p>
              </div>

              <div class="actions">
                <button mat-raised-button color="warn" (click)="confirmDelete(state.product.id)">
                  <mat-icon>delete</mat-icon>
                  Eliminar Producto
                </button>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="reviews-section">
            <h2>
              <mat-icon>rate_review</mat-icon>
              Reseñas de Clientes
            </h2>

            <div class="empty-reviews" *ngIf="state.reviews.length === 0">
              <mat-icon>comment</mat-icon>
              <p>Este producto aún no tiene reseñas</p>
            </div>

            <div class="reviews-list" *ngIf="state.reviews.length > 0">
              <mat-card *ngFor="let review of state.reviews" class="review-card">
                <mat-card-header>
                  <div class="review-header">
                    <div>
                      <h4>{{ review.reviewerName }}</h4>
                      <p class="reviewer-email">{{ review.reviewerEmail }}</p>
                    </div>
                    <div class="review-rating">
                      <mat-icon>star</mat-icon>
                      <span>{{ review.rating }}</span>
                    </div>
                  </div>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ review.comment }}</p>
                  <p class="review-date">{{ review.date | date:'dd/MM/yyyy' }}</p>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit {
  state$!: Observable<ProductDetailState>;
  currentImage = signal<string>('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.state$ = this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        if (!id) return of({ product: null, reviews: [], loading: false, error: 'Producto no válido' });

        return this.productsService.getProductById(id).pipe(
          map(product => {
            if (product.images.length > 0) this.currentImage.set(product.images[0]);
            return {
              product,
              reviews: product.reviews,
              loading: false,
              error: null
            };
          }),
          catchError(() => of({
            product: null,
            reviews: [],
            loading: false,
            error: 'No se pudo cargar el producto. Verifica que el ID sea correcto.'
          }))
        );
      })
    );
  }

  confirmDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: '¿Eliminar producto?',
        message: 'Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este producto?'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) this.deleteProduct(id);
    });
  }

  private deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.toastService.showSuccess('Producto eliminado exitosamente');
        this.router.navigate(['/products']);
      },
      error: () => this.toastService.showError('Error al eliminar el producto')
    });
  }
}