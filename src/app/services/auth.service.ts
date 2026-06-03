import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_image?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public storageUrl = environment.storageUrl + '/';
  private authToken$ = new BehaviorSubject<string | null>(null);
  private currentUser$ = new BehaviorSubject<any>(null);

  getProfileImage(path: string | null | undefined, name: string): string {
    if (!path) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C68E17&color=fff`;
    }
    // If path is already a full URL (from backend accessor), return it
    if (path.startsWith('http')) {
      return path;
    }
    return this.storageUrl + path;
  }

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.authToken$.next(token);
      const user = localStorage.getItem('current_user');
      if (user) {
        this.currentUser$.next(JSON.parse(user));
      }
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.authToken$.next(response.token);
          this.currentUser$.next(response.user);
        }
      })
    );
  }

  registerBuyer(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register-buyer`, { name, email, password });
  }

  registerSeller(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register-seller`, { name, email, password });
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {}, { headers: this.getHeaders() }).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.authToken$.next(null);
    this.currentUser$.next(null);
  }

  getToken(): string | null {
    return this.authToken$.value;
  }

  getToken$(): Observable<string | null> {
    return this.authToken$.asObservable();
  }

  getCurrentUser(): any {
    return this.currentUser$.value;
  }

  getCurrentUser$(): Observable<any> {
    return this.currentUser$.asObservable();
  }

  isAuthenticated(): boolean {
    return !!this.authToken$.value;
  }

  isAuthenticated$(): Observable<boolean> {
    return this.authToken$.pipe(map(token => !!token));
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`, { headers: this.getHeaders() }).pipe(
      tap((user) => {
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUser$.next(user);
      })
    );
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        if (response.user) {
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.currentUser$.next(response.user);
        }
      })
    );
  }

  updateAvatar(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile/avatar`, formData, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        if (response.user) {
          localStorage.setItem('current_user', JSON.stringify(response.user));
          this.currentUser$.next(response.user);
        }
      })
    );
  }
}
