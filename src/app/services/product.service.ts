import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

export interface Product {
    id: number;
    seller_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    profile_image?: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    seller?: {
        id: number;
        name: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = environment.apiUrl;
    public storageUrl = environment.storageUrl + '/';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getProducts(params: { search?: string, category?: string, min_price?: number, max_price?: number, sort_by?: string } = {}): Observable<any> {
        let url = `${this.apiUrl}/products?`;
        if (params.search) url += `search=${params.search}&`;
        if (params.category) url += `category=${params.category}&`;
        if (params.min_price) url += `min_price=${params.min_price}&`;
        if (params.max_price) url += `max_price=${params.max_price}&`;
        if (params.sort_by) url += `sort_by=${params.sort_by}&`;
        return this.http.get<any>(url);
    }

    getProduct(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/products/${id}`);
    }

    getProductReviews(productId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/products/${productId}/reviews`);
    }

    postReview(data: { product_id: number, order_id: number, rating: number, review: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/reviews`, data, { headers: this.getHeaders() });
    }

    // WISHLIST METHODS
    getWishlist(): Observable<any> {
        return this.http.get(`${this.apiUrl}/wishlist`, { headers: this.getHeaders() });
    }

    toggleWishlist(productId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/wishlist/toggle`, { product_id: productId }, { headers: this.getHeaders() });
    }

    checkWishlist(productId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/wishlist/check/${productId}`, { headers: this.getHeaders() });
    }

    getCategories(): Observable<any> {
        return this.http.get(`${this.apiUrl}/categories`);
    }
}
