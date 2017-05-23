import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { environment } from './../environments/environment';

const constURL: string = `${environment.constURL}/api`;
const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).token : '';

@Injectable()
export class UserService {

  constructor(
    private http: Http,
  ) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  getUser() {
    const user = localStorage.getItem('currentUser');
    // ternary operate that checks if user exists, if not sets token to blank which will send user to login
    const token = user ? JSON.parse(user).token : '';
    const headers = new Headers({ 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/user/status`, options)
      // return this.http.get(`/api/user/status`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getInstanceUsers() {
    const user = localStorage.getItem('currentUser');
    // ternary operate that checks if user exists, if not sets token to blank which will send user to login
    const token = user ? JSON.parse(user).token : '';
    const headers = new Headers({ 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/user/`, options)
      .map(res => res.json().user);
  }

  getOneUser(id: string): any {
    const user = localStorage.getItem('currentUser');
    // ternary operate that checks if user exists, if not sets token to blank which will send user to login
    const token = user ? JSON.parse(user).token : '';
    const headers = new Headers({ 'x-auth': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(`${constURL}/user/query?_id=${id}`, options)
      .map(res => {
        return res.json().user;
      })
      .catch(this.handleError);
  }

  newUser(model: any): any {
    let paths = [];
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`${constURL}/user`, model, options)
      .map(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  editUser(id: string, user: any): any {
    let currentUser = localStorage.getItem('currentUser');
    // ternary operate that checks if user exists, if not sets token to blank which will send user to login
    let token = user ? JSON.parse(currentUser).token : '';
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let option = new RequestOptions({ headers: headers });

    return this.http.patch(`${constURL}/user/updateUser/${id}`, user, option)
      .map(res => {
        return res.json().user;
      })
      .catch(this.handleError);
  }

  deleteUser(id: string): any {
    const user = localStorage.getItem('currentUser');
    // ternary operate that checks if user exists, if not sets token to blank which will send user to login
    const token = user ? JSON.parse(user).token : '';
    const headers = new Headers({ 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(`${constURL}/user/${id}`, options)
      .map(res => {
        return res.json();
      })
      .catch(this.handleError);
  }

  submitChangePassword(passwordModel: any, token: string): any {
    const user = localStorage.getItem('currentUser');
    let headers;

    // if token has been submitted then it is a password reset, if there is no token then this is a logged in user request and we can grab token from the storage. We will also set the x-auth-type to auth or reset and this will alter the server request
    if (token === null) {
      // ternary operate that checks if user exists, if not sets token to blank which will send user to login
      token = user ? JSON.parse(user).token : '';
      headers = new Headers({ 'x-auth': token, 'x-auth-type': 'auth' });
    } else {
      headers = new Headers({ 'x-auth': token, 'x-auth-type': 'reset' });
    }

    const options = new RequestOptions({ headers });

    return this.http.patch(`${constURL}/user/profilePasswordChange`, passwordModel, options)
      .map(res => {
        return res.json();
      })
      .catch(err => {
        return Observable.of(false);
      });
  }

  forgotPassword(email: string) {
    const body = { email };

    return this.http.post(`${constURL}/user/passwordreset`, body)
      .map(res => res.json())
      .catch(err => {
        return Observable.of(false);
      });
  }
}
