import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import {
    Product,
    ProductsResponse,
    ReviewsResponse,
    CreateProductDto,
    DeleteProductResponse
} from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private readonly baseUrl = 'https://dummyjson.com';
    private categoriesCache$?: Observable<string[]>;

    constructor(private http: HttpClient) { }

    getProducts(limit: number = 30, skip: number = 0): Observable<ProductsResponse> {
        const params = new HttpParams()
            .set('limit', limit.toString())
            .set('skip', skip.toString());

        return this.http.get<ProductsResponse>(`${this.baseUrl}/products`, { params });
    }

    searchProducts(query: string, limit: number = 30, skip: number = 0): Observable<ProductsResponse> {
        const params = new HttpParams()
            .set('q', query)
            .set('limit', limit.toString())
            .set('skip', skip.toString());

        return this.http.get<ProductsResponse>(`${this.baseUrl}/products/search`, { params });
    }

    getCategories(): Observable<string[]> {
        if (!this.categoriesCache$) {
            this.categoriesCache$ = this.http
                .get<string[]>(`${this.baseUrl}/products/category-list`)
                .pipe(shareReplay(1));
        }
        return this.categoriesCache$;
    }

    getProductsByCategory(category: string, limit: number = 30, skip: number = 0): Observable<ProductsResponse> {
        const params = new HttpParams()
            .set('limit', limit.toString())
            .set('skip', skip.toString());

        return this.http.get<ProductsResponse>(
            `${this.baseUrl}/products/category/${category}`,
            { params }
        );
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
    }

    createProduct(product: CreateProductDto): Observable<Product> {
        return this.http.post<Product>(`${this.baseUrl}/products/add`, product)
            .pipe(
                tap(response => {
                    console.log('✅ Producto creado correctamente - Respuesta de la API:', response);
                })
            );
    }

    deleteProduct(id: number): Observable<DeleteProductResponse> {
        return this.http.delete<DeleteProductResponse>(`${this.baseUrl}/products/${id}`)
            .pipe(
                tap(response => {
                    console.log('✅ Producto eliminado correctamente - Respuesta de la API:', response);
                })
            );
    }
}