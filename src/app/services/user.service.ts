import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class UserService {

  constructor( private http: HttpClient ) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  getUser() {
    return this.http.get(`${constURL}/users/status`)
      .map(res => res)
      .catch(this.handleError);
  }

  getInstanceUsers() {
    return this.http.get<any>(`${constURL}/users/`)
      .map(res => res.user)
      .catch(this.handleError)
  }

  getOneUser(id: string): any {
    return this.http.get<any>(`${constURL}/users/query?_id=${id}`)
      .map(res => res.user)
      .catch(this.handleError);
  }

  newUser(model: any): any {
    const paths = [];
    return this.http.post(`${constURL}/users`, model)
      .map(res => res)
      .catch(this.handleError);
  }

  editUser(id: string, user: any): any {
    return this.http.patch<any>(`${constURL}/users/updateUser/${id}`, user)
      .map(res => res.user)
      .catch(this.handleError);
  }

  deconsteUser(id: string): any {
    return this.http.delete(`${constURL}/users/${id}`)
      .map(res => res)
      .catch(this.handleError);
  }

  submitChangePassword(passwordModel: any, token: string): any {
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
    return this.http.patch(`${constURL}/users/profilePasswordChange`, passwordModel)
      .map(res => res)
      .catch(() => {
        return Observable.of(false);
      });
  }

  forgotPassword(email: string, host: string) {
    const body = { email, host };

    return this.http.post(`${constURL}/users/passwordreset`, body)
      .map(res => res)
      .catch(err => {
        return Observable.of(false);
      });
  }
}
