import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { environment } from '../environments/environment';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class AuthenticationService {

  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();

  constructor( private http: Http ) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post(`${constURL}/users/login`, { email, password })
      .map(res => {
        return true;
      })
      .catch(err => {
        console.log(err);
        return Observable.of(false);
      });
  }

  logout(): Observable<boolean> {
    // clear token remove user from local storage to log user out
    return this.http.delete(`${constURL}/users/`)
      .map(res => {
        return true;
      })
      .catch(err => {
        return Observable.of(false);
      });
  }

  // get the Current User information to display in page
  getUser() {
    return this.http.get(`${constURL}/users/status`)
      .map(res => res.json());
  }

  // Service message commands
  emitChange(change) {
    this.emitChangeSource.next(change);
  }

}
