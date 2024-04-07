import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  jwtHelper: JwtHelperService = new JwtHelperService()

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const tokenString = localStorage.getItem('access_token')
    const url: string = request.url
    
    if (tokenString && !url.endsWith('/oauth/token')) {
      const token = JSON.parse(tokenString)
      if (token.access_token) {
        const jwt = token.access_token
        if(!this.jwtHelper.isTokenExpired(jwt)) {
          const tokenFormat = 'Bearer'
          request = request.clone({
            setHeaders: {
              'Authorization': `${tokenFormat} ${jwt}`
            }
          })
        }
      }
    }
    return next.handle(request);
  }
}
