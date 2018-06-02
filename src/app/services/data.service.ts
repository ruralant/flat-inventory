
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BadInputError } from 'app/common/errors/bad-input-error';
import { NotFoundError } from 'app/common/errors/not-found-error';
import { AppError } from 'app/common/errors/app-error';

@Injectable()
export class DataService {

  constructor( protected url: string, protected http: HttpClient ) { }

  getAll(param = '') {
    return this.http.get(`${this.url}${param}`);
  }

  getQueried(queryString: string) {
    return this.http.get(`${this.url}query?${queryString}`);
  }

  postNew(payload) {
    return this.http.post(`${this.url}`, payload);
  }

  delete(id) {
    return this.http.delete(`${this.url}/${id}`);
  }

  patchSaved(id, payload) {
    return this.http.patch(`${this.url}/${id}`, payload);
  }

}
