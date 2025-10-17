// src/app/features/products/product-create.ts

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { ToastService } from '../../core/services/toast.service';
import { CreateProductDto } from '../../core/models/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="create-container">
      <div class="back-button">
        <button mat-button routerLink="/products">
          <mat-icon>arrow_back</mat-icon>
          Volver al catálogo
        </button>
      </div>

      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>add_box</mat-icon>
            Agregar Nuevo Producto
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Título del Producto</mat-label>
                <input matInput formControlName="title" placeholder="Ej: iPhone 14 Pro">
                <mat-error *ngIf="productForm.get('title')?.hasError('required')">
                  El título es obligatorio
                </mat-error>
                <mat-error *ngIf="productForm.get('title')?.hasError('minlength')">
                  El título debe tener al menos 3 caracteres
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>$ Precio</mat-label>
                <input matInput type="number" formControlName="price" placeholder="0.00">
                <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                  El precio es obligatorio
                </mat-error>
                <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                  El precio debe ser mayor a 0
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Marca</mat-label>
                <input matInput formControlName="brand" placeholder="Ej: Apple">
                <mat-error *ngIf="productForm.get('brand')?.hasError('required')">
                  La marca es obligatoria
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Categoría</mat-label>
                <mat-select formControlName="category">
                  <mat-option *ngFor="let cat of categories$ | async" [value]="cat">
                    {{ cat }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="productForm.get('category')?.hasError('required')">
                  La categoría es obligatoria
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción</mat-label>
                <textarea 
                  matInput 
                  formControlName="description" 
                  rows="4"
                  placeholder="Describe las características del producto...">
                </textarea>
                <mat-error *ngIf="productForm.get('description')?.hasError('required')">
                  La descripción es obligatoria
                </mat-error>
                <mat-error *ngIf="productForm.get('description')?.hasError('minlength')">
                  La descripción debe tener al menos 10 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/products">
                Cancelar
              </button>
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="productForm.invalid || isSubmitting">
                <mat-icon>save</mat-icon>
                {{ isSubmitting ? 'Guardando...' : 'Guardar Producto' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./product-create.scss']

})
export class ProductCreateComponent {
  productForm: FormGroup;
  categories$: Observable<string[]>;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.categories$ = this.productsService.getCategories();
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const productData: CreateProductDto = this.productForm.value;

      this.productsService.createProduct(productData).subscribe({
        next: () => {
          this.toastService.showSuccess('Producto creado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.toastService.showError('Error al crear el producto');
          console.error('Error:', error);
        }
      });
    }
  }
}