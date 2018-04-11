import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import { AuthenticationService } from 'app/services/authentication.service';
import { environment } from '../../environments/environment';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private http: Http,
    private authenticationService: AuthenticationService,
  ) { }

  // this is the middleware to authenticate all the users
  canActivate(route) {
    return this.http.get(`${constURL}/users/status`)
      .map(res => true)
      .catch(err => {
        this.router.navigate(['/login']);
        this.authenticationService.emitChange('logout');
        return Observable.of(false);
      });
  }
}
