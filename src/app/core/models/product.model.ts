export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    reviews: Review[];
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

export interface ReviewsResponse {
    reviews: Review[];
    total: number;
    skip: number;
    limit: number;
}

export interface CreateProductDto {
    title: string;
    price: number;
    brand: string;
    category: string;
    description: string;
}

export interface DeleteProductResponse {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    isDeleted: boolean;
    deletedOn: string;
}