import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { RoutingModule } from './routing/routing.module';

import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { ApartmentService } from './apartment.service';
import { UserService } from './user.service';
import { ItemService } from './item.service';
import { SnackbarService } from './snackbar.service';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { EditAptComponent } from './apartment/edit-apt.component';
import { ApartmentSectionComponent } from './apartment/apartment-section.component';
import { TopnavComponent } from './topnav/topnav.component';
import { RoomComponent } from './room/room.component';
import { RoomSectionComponent } from './room/room-section.component';
import { EditRoomComponent } from './room/edit-room.component';
import { ItemComponent } from './item/item.component';
import { EditItemComponent } from './item/edit-item.component';
import { CreateItemComponent } from './item/create-item.component';
import { ItemSectionComponent } from './item/item-section.component';
import { ItemsViewComponent } from './item/items-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    HomeComponent,
    ApartmentComponent,
    EditAptComponent,
    ApartmentSectionComponent,
    TopnavComponent,
    RoomComponent,
    RoomSectionComponent,
    EditRoomComponent,
    ItemComponent,
    EditItemComponent,
    CreateItemComponent,
    ItemSectionComponent,
    ItemsViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    AuthGuardService,
    AuthenticationService,
    UserService,
    ApartmentService,
    ItemService,
    SnackbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
