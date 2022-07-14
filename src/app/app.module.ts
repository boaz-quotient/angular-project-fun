import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MainSearchBarComponent } from './main-search-bar/main-search-bar.component';
import { ResultsItemsComponent } from './results-items/results-items.component';
import { CardComponent } from './card/card.component';
import { AlertComponent } from './alert/alert.component';
import { SkeletonComponent } from './skeleton/skeleton.component';

@NgModule({
  declarations: [
    AppComponent,
    MainSearchBarComponent,
    ResultsItemsComponent,
    CardComponent,
    AlertComponent,
    SkeletonComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
