import { AuthGuardService } from './auth-guard.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { AuthenticationService } from 'app/services/authentication.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor( private injector: Injector ) {}

  intercept(req, next) {
    const auth = this.injector.get(AuthenticationService);
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `token ${auth.token}`)
    })
    return next.handle(authRequest);
  }
}
