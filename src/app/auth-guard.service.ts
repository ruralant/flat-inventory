import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { environment } from './../environments/environment';

import { AuthenticationService } from './authentication.service';

const constURL: string = `${environment.constURL}/api`;

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private http: Http) { }

  User: any;

  // this is the middleware to authenticate all the users
  canActivate() {
    const user = localStorage.getItem('currentUser');
    // ternary operate that checks if user exists, if not sets token to blank which will send user to login
    const token = user ? JSON.parse(user).token : '';
    const headers = new Headers({ 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/users/status`, options)
      // return this.http.get(`/api/user/status`, options)
      .map(res => {
        this.User = res.json();
        return true;
      })
      .catch(err => {
        this.router.navigate(['/login']);
        return Observable.of(false);
      });
  }

}
