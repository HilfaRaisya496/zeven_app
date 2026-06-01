import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AddressService {
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

    getAddresses(): Observable<any> {
        return this.http.get(`${this.apiUrl}/addresses`, { headers: this.getHeaders() });
    }

    addAddress(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/addresses`, data, { headers: this.getHeaders() });
    }

    updateAddress(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/addresses/${id}`, data, { headers: this.getHeaders() });
    }

    deleteAddress(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/addresses/${id}`, { headers: this.getHeaders() });
    }

    setMainAddress(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/addresses/${id}/set-main`, {}, { headers: this.getHeaders() });
    }
}
