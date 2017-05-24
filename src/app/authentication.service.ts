import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { environment } from './../environments/environment';

const constURL: string = `${environment.constURL}/api`;

@Injectable()
export class AuthenticationService {
  public token: string;

  constructor(private http: Http) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post(`${constURL}/users/login`, { email, password })
      .map(res => {
        let token = res.json() && res.json().token;
        this.token = token;
        localStorage.setItem('currentUser', JSON.stringify({ email, token }));
        return true;
      })
      .catch(err => {
        return Observable.of(false);
      });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

}
