import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly API_LOGIN = 'https://api.lykon.com.br/auth/login';
  private lembrar : boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; senha: string }) {
    return this.http.post<{ token: string }>(this.API_LOGIN, credentials);
  }

  saveToken(token: string, lembrar : boolean): void {
    this.lembrar = lembrar;
    if(lembrar){
        localStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.removeItem(this.TOKEN_KEY);
    }
    else{
        sessionStorage.setItem(this.TOKEN_KEY, token);
        localStorage.removeItem(this.TOKEN_KEY);
    }
    
  }

  getToken(): string | null {
    return this.lembrar ? localStorage.getItem(this.TOKEN_KEY) : sessionStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  validateToken() {
    const token = this.getToken();
    return this.http.get<{ valid: boolean }>(
      'https://api.lykon.com.br/auth/validate',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

}
