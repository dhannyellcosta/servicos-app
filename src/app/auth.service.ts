import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './login/usuario';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL: string = environment.apiURLBase + '/api/usuarios'
  tokenUrl: string = environment.apiURLBase + environment.obterTokenURL
  clientId: string = environment.clientId
  clientSecret: string = environment.clientSecret
  jwtHelper: JwtHelperService = new JwtHelperService()

  constructor(private httpClient: HttpClient) { }

  obterTooken() {
    const tokenString = localStorage.getItem('access_token')
    if (tokenString) {
      const token = JSON.parse(tokenString).access_token
      return token
    }
    return null
  }

  isAuthenticated(): boolean {
    const token = this.obterTooken()
    if (token) {
      const expired = this.jwtHelper.isTokenExpired(token)
      return !expired
    }
    return false
  }

  salvar(usuario: Usuario): Observable<any> {
    return this.httpClient.post<any>(this.apiURL, usuario)
  }

  tentarLogar(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password')

    const headers = {
      'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    return this.httpClient.post(this.tokenUrl, params.toString(), { headers })
  }

  encerrarSessao() {
    localStorage.removeItem('access_token')
  }

  getUsuarioAutenticado() {
    const token = this.obterTooken()
    if (token) {
      const usuario = this.jwtHelper.decodeToken(token).user_name
      return usuario
    }
    return null
  }
}
