import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from 'app/routing/routing.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from 'app/services/authentication.service';
import { AuthGuardService } from 'app/services/auth-guard.service';
import { ApartmentService } from 'app/services/apartment.service';
import { UserService } from 'app/services/user.service';
import { ItemService } from 'app/services/item.service';
import { DataService } from 'app/services/data.service';
import { AuthInterceptorService } from 'app/services/authInterceptor.service';

import { AppComponent } from 'app/app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from 'app/login/login.component';
import { HomeComponent } from 'app/home/home.component';
import { ApartmentComponent } from 'app/apartment/apartment.component';
import { EditAptComponent } from 'app/apartment/edit-apt.component';
import { ApartmentSectionComponent } from 'app/apartment/apartment-section.component';
import { TopnavComponent } from 'app/topnav/topnav.component';
import { RoomComponent } from 'app/room/room.component';
import { RoomSectionComponent } from 'app/room/room-section.component';
import { EditRoomComponent } from 'app/room/edit-room.component';
import { ItemComponent } from 'app/item/item.component';
import { EditItemComponent } from 'app/item/edit-item.component';
import { CreateItemComponent } from 'app/item/create-item.component';
import { ItemSectionComponent } from 'app/item/item-section.component';
import { ItemsViewComponent } from 'app/item/items-view.component';
import { CreateAptComponent } from 'app/apartment/create-apt.component';
import { CreateRoomComponent } from 'app/room/create-room.component';
import { AppErrorHandler } from 'app/common/errors/app-error-handlet';
import { RegisterComponent } from './register/register.component';

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
    ItemsViewComponent,
    CreateAptComponent,
    CreateRoomComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatExpansionModule,
    MatIconModule
  ],
  exports: [
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatGridListModule,
    MatExpansionModule,
    MatIconModule
  ],
  providers: [
    AuthGuardService,
    AuthenticationService,
    UserService,
    ApartmentService,
    ItemService,
    DataService,
    AuthInterceptorService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
