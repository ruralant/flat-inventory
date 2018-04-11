import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { BadInputError } from 'app/common/errors/bad-input-error';
import { NotFoundError } from 'app/common/errors/not-found-error';
import { AppError } from 'app/common/errors/app-error';

@Injectable()
export class DataService {

  constructor( protected url: string, protected http: Http ) { }

  getAll(param = '') {
    return this.http.get(`${this.url}${param}`)
      .map(res => res.json())
  }

  getQueried(queryString: string) {
    return this.http.get(`${this.url}query?${queryString}`)
      .map(response => response.json());
  }

  postNew(payload) {
    return this.http.post(`${this.url}`, payload)
      .map(response => response.json())
      .catch(this.handleError);
  }

  delete(id) {
    return this.http.delete(`${this.url}/${id}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  patchSaved(id, payload) {
    return this.http.patch(`${this.url}/${id}`, payload)
      .map(response => response.json())
      .catch(this.handleError);
  }

  protected handleError(error: Response) {
    if (error.status === 400) {
      return Observable.throw(new BadInputError(error.json()));
    }

    if (error.status === 404) {
      return Observable.throw(new NotFoundError());
    }

    return Observable.throw(new AppError(error));
  }

}
