import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddAccountComponent } from './add-account/add-account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'

import { HomeComponent } from './home/home.component';
import { HttpClientModule } from "@angular/common/http";

import { PlaidService } from "./plaid.service";
import { RemoveAccountComponent } from './remove-account/remove-account.component';

@NgModule({
  declarations: [
    AppComponent,
    AddAccountComponent,
    HomeComponent,
    RemoveAccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    HttpClientModule
  ],
  providers: [PlaidService],
  bootstrap: [AppComponent]
})
export class AppModule { }
