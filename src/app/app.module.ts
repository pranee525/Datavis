import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VishomeComponent } from './vishome/vishome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatGridListModule} from '@angular/material/grid-list';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MaterialModule} from '../../src/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import { Routes, RouterModule } from '@angular/router';
import { BottomupVisComponent } from './bottomup-vis/bottomup-vis.component';
import { FullTreeComponent } from './full-tree/full-tree.component'; // CLI imports router





@NgModule({
  declarations: [
    AppComponent,
    VishomeComponent,
    DashboardComponent,
    BottomupVisComponent,
    FullTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports:[],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
