import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from 'app/services/authentication.service';
import { environment } from '../../environments/environment';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  errorHandler() {
    this.router.navigate(['/login']);
    this.authenticationService.emitChange('logout');
    return Observable.throw(false);
  }

  // this is the middleware to authenticate all the users
  canActivate() {
    return this.http.get<any>(`${constURL}/users/status`).pipe(
      map(() => true),
      catchError(this.errorHandler));
  }
}
