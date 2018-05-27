import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';

import { ItemService } from 'app/services/item.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  itemToBeModified: any = {};

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.itemService.getOneItem(params.get('id'))
          .subscribe(item => this.itemToBeModified = item[0]);
      })
  }

}
