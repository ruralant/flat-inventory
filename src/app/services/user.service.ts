import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../common/interface/user';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class UserService {

  constructor( private http: HttpClient ) { }

  errorHandler() {
    return Observable.throw(false);
  }

  getUser() {
    return this.http.get<User>(`${constURL}/users/status`);
  }

  getInstanceUsers() {
    return this.http.get<User[]>(`${constURL}/users/`);
  }

  getOneUser(id: string) {
    return this.http.get<User>(`${constURL}/users/query?_id=${id}`);
  }

  newUser(model: User) {
    return this.http.post(`${constURL}/users`, model);
  }

  editUser(id: string, user: User) {
    return this.http.patch<any>(`${constURL}/users/update-user/${id}`, user);
  }

  deconsteUser(id: string) {
    return this.http.delete(`${constURL}/users/${id}`);
  }

  submitChangePassword(passwordModel: object, token: string): any {
    const user = localStorage.getItem('currentUser');
    let headers;
    // if token has been submitted then it is a password reset, if there is no token then this is a logged in user request
    // and we can grab token from the storage. We will also set the x-auth-type to auth or reset and this will alter the server request
    if (token === null) {
      // ternary operate that checks if user exists, if not sets token to blank which will send user to login
      token = user ? JSON.parse(user).token : '';
      headers = new Headers({ 'x-auth': token, 'x-auth-type': 'auth' });
    } else {
      headers = new Headers({ 'x-auth': token, 'x-auth-type': 'reset' });
    }

    const options = new RequestOptions({ headers });

    // you returned this already no need to do it twice
    return this.http.patch<any>(`${constURL}/users/profilePasswordChange`, passwordModel).pipe(
      map(res => res),
      catchError(this.errorHandler));
  }

  forgotPassword(email: string, host: string) {
    const body = { email, host };

    return this.http.post<any>(`${constURL}/users/passwordreset`, body).pipe(
      map(res => res),
      catchError(this.errorHandler));
  }
}
