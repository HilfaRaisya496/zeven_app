import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = environment.apiUrl;

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

    checkout(shippingAddress: string, voucherCode: string = '', cartItemIds: number[] = []): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/checkout`, {
            shipping_address: shippingAddress,
            voucher_code: voucherCode,
            cart_item_ids: cartItemIds
        }, { headers: this.getHeaders() });
    }

    checkVoucher(code: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/vouchers/check`, { code }, { headers: this.getHeaders() });
    }

    getMyOrders(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/my-orders`, { headers: this.getHeaders() });
    }

    getOrderDetails(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/orders/${id}`, { headers: this.getHeaders() });
    }

    uploadPaymentProof(id: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('payment_proof', file);
        return this.http.post<any>(`${this.apiUrl}/orders/${id}/payment`, formData, { headers: this.getHeaders() });
    }

    updateOrderStatus(id: number, status: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/orders/${id}/status`, { status }, { headers: this.getHeaders() });
    }

    extendWarranty(id: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/orders/${id}/extend-warranty`, {}, { headers: this.getHeaders() });
    }

    getActiveVouchers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/vouchers/active`, { headers: this.getHeaders() });
    }
}
