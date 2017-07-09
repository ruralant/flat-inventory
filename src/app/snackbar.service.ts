import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class SnackbarService {

  constructor(private snackBar: MdSnackBar) {
  }

  showSnackBar(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 3000
    });
  }
}