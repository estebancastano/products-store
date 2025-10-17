import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/products',
        pathMatch: 'full'
    },
    {
        path: 'products',
        loadComponent: () => import('./features/products/products-list').then(m => m.ProductsListComponent)
    },
    {
        path: 'products/new',
        loadComponent: () => import('./features/products/product-create').then(m => m.ProductCreateComponent)
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./features/products/product-detail').then(m => m.ProductDetailComponent)
    },
    {
        path: '**',
        redirectTo: '/products'
    }
];