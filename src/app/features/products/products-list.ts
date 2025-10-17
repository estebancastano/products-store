// src/app/features/products/products-list.ts

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { combineLatest, Observable, BehaviorSubject, of } from 'rxjs';
import { debounceTime, switchMap, startWith, map, catchError, tap, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { ProductsService } from '../../core/services/products.service';
import { Product, ProductsResponse } from '../../core/models/product.model';

interface ProductsState {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="products-container">
      <header class="header">
        <h1>Catálogo de Productos</h1>
        <button mat-raised-button color="primary" routerLink="/products/new">
          <mat-icon>add</mat-icon>
          Agregar Producto
        </button>
      </header>

      <div class="filters">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar productos</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Escribe para buscar...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="category-field">
          <mat-label>Categoría</mat-label>
          <mat-select [formControl]="categoryControl">
            <mat-option value="">Todas las categorías</mat-option>
            <mat-option *ngFor="let category of categories$ | async" [value]="category">
              {{ category }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <ng-container *ngIf="state$ | async as state">
        <div class="loading-container" *ngIf="state.loading">
          <mat-spinner></mat-spinner>
          <p>Cargando productos...</p>
        </div>

        <div class="error-container" *ngIf="state.error && !state.loading">
          <mat-icon color="warn">error</mat-icon>
          <p>{{ state.error }}</p>
        </div>

        <div class="empty-container" *ngIf="!state.loading && !state.error && state.products.length === 0">
          <mat-icon>inventory_2</mat-icon>
          <p>No se encontraron productos</p>
        </div>

        <div class="products-grid" *ngIf="!state.loading && !state.error && state.products.length > 0">
          <mat-card *ngFor="let product of state.products" class="product-card">
            <img mat-card-image [src]="product.thumbnail" [alt]="product.title" class="product-image">
            <mat-card-content>
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-brand">{{ product.brand }}</p>
              <div class="product-info">
                <span class="product-category">{{ product.category | titlecase }}</span>
                <span class="product-rating">
                  <mat-icon>star</mat-icon>
                  {{ product.rating }}
                </span>
              </div>
              <p class="product-price">\${{ product.price }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" [routerLink]="['/products', product.id]">
                Ver Detalle
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <mat-paginator
          *ngIf="!state.loading && state.products.length > 0"
          [length]="state.total"
          [pageSize]="pageSize"
          [pageIndex]="currentPage"
          [pageSizeOptions]="[15, 30, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </ng-container>
    </div>
  `,
  styleUrls: ['./products-list.scss']


})
export class ProductsListComponent implements OnInit {
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  categories$: Observable<string[]>;
  state$!: Observable<ProductsState>;
  private pageSubject = new BehaviorSubject<PageEvent>({ pageIndex: 0, pageSize: 32, length: 0 });
  currentPage = 0;
  pageSize = 32;

  constructor(private productsService: ProductsService) {
    this.categories$ = this.productsService.getCategories();
  }

  ngOnInit(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.resetPagination())
    );

    const category$ = this.categoryControl.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
      tap(() => this.resetPagination())
    );

    this.state$ = combineLatest([search$, category$, this.pageSubject]).pipe(
      switchMap(([search, category, page]) => {
        const skip = page.pageIndex * page.pageSize;
        const limit = page.pageSize;

        // Priorizar la búsqueda si ambos están activos
        let request$: Observable<ProductsResponse>;

        if (search && search.trim()) {
          // Si hay búsqueda, usar el endpoint de búsqueda (trae más resultados para filtrar)
          request$ = this.productsService.searchProducts(search.trim(), 100, 0);
        } else if (category) {
          // Si solo hay categoría, usar el endpoint de categoría
          request$ = this.productsService.getProductsByCategory(category, 100, 0);
        } else {
          // Si no hay filtros, obtener todos los productos
          request$ = this.productsService.getProducts(limit, skip);
        }

        return request$.pipe(
          map(response => {
            let filtered = response.products;

            // Aplicar filtros combinados en el frontend
            if (search && search.trim()) {
              const searchLower = search.trim().toLowerCase();
              filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower) ||
                p.brand?.toLowerCase().includes(searchLower)
              );
            }

            if (category) {
              filtered = filtered.filter(p =>
                p.category.toLowerCase() === category.toLowerCase()
              );
            }

            // Aplicar paginación manual cuando hay filtros combinados
            const total = filtered.length;
            const start = page.pageIndex * page.pageSize;
            const end = start + page.pageSize;
            const paginatedProducts = (search || category)
              ? filtered.slice(start, end)
              : filtered;

            return {
              products: paginatedProducts,
              total: (search || category) ? total : response.total,
              loading: false,
              error: null
            };
          }),
          startWith({ products: [], total: 0, loading: true, error: null }),
          catchError(error => {
            console.error('Error al cargar productos:', error);
            return of({
              products: [],
              total: 0,
              loading: false,
              error: 'Error al cargar los productos. Por favor, intenta nuevamente.'
            });
          })
        );
      }),
      shareReplay(1)
    );
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.pageSubject.next(event);
  }

  private resetPagination(): void {
    this.currentPage = 0;
    this.pageSubject.next({ pageIndex: 0, pageSize: this.pageSize, length: 0 });
  }
}
