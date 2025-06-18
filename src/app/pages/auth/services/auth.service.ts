import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DadosUsuario } from '../models/dadosusuario.model';
import { Cargo } from '../../funcionarios/models/cargo.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly DADOS_USUARIO_KEY = 'usuario-nome';
  private readonly API_LOGIN = 'https://api.lykon.com.br/auth/login';
  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; senha: string }) {
    return this.http.post<DadosUsuario>(this.API_LOGIN, credentials);
  }

  saveToken(token: string, lembrar : boolean): void {

    if(lembrar){
        localStorage.setItem(this.TOKEN_KEY, token);
        sessionStorage.removeItem(this.TOKEN_KEY);
    }
    else{
        sessionStorage.setItem(this.TOKEN_KEY, token);
        localStorage.removeItem(this.TOKEN_KEY);
    }
    
  }

  saveDadosUsuario(dadosUsuario : DadosUsuario, lembrar : boolean){
    this.saveToken(dadosUsuario.token, lembrar);
    if(lembrar){
      localStorage.setItem(this.DADOS_USUARIO_KEY, JSON.stringify({nome: dadosUsuario.nome, cargo:dadosUsuario.cargo, modulo:dadosUsuario.modulo}));
      sessionStorage.removeItem(this.DADOS_USUARIO_KEY);
    }
    else{
      sessionStorage.setItem(this.DADOS_USUARIO_KEY, JSON.stringify({nome: dadosUsuario.nome, cargo:dadosUsuario.cargo, modulo:dadosUsuario.modulo}));
      localStorage.removeItem(this.DADOS_USUARIO_KEY);
    }

  }

  getNome() : string | null{
    return this.getObjeto()?.nome ?? null;
  }

  getModulo(): string | null{
    return this.getObjeto()?.modulo ?? null;
  }

  private getObjeto(): DadosUsuario | null{
    const dadosLocal = localStorage.getItem(this.DADOS_USUARIO_KEY);
    if (dadosLocal !== null) {
      return JSON.parse(dadosLocal);
    }

    const dadosSession = sessionStorage.getItem(this.DADOS_USUARIO_KEY);
    if (dadosSession !== null) {
      return JSON.parse(dadosSession);
    }

    return null;
  }

  getCargo(): Cargo | null {
    return this.getObjeto()?.cargo ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.router.navigateByUrl('/');
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
