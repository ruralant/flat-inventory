import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  Subject } from 'rxjs';





import { environment } from '../../environments/environment';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class AuthenticationService {

  // Observable string sources
  private emitChangeSource = new Subject<any>();
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();

  TOKEN_KEY = 'token';

  constructor( private http: HttpClient ) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY)
  }

  register(data: object) {
    return this.http.post(`${constURL}/users/register`, data)
      .map(res => res);
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${constURL}/users/login`, { email, password })
      .map(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        return res;
      })
  }

  logout(): Observable<boolean> {
    // clear token remove user from local storage to log user out
    return this.http.delete(`${constURL}/users/`)
      .map(res => {
        return true;
      })
      .catch(() => {
        return Observable.of(false);
      });
  }

  // Service message commands
  emitChange(change) {
    this.emitChangeSource.next(change);
  }
}
