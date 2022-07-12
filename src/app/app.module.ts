import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainSearchBarComponent } from './main-search-bar/main-search-bar.component';
import { ResultsItemsComponent } from './results-items/results-items.component';

@NgModule({
  declarations: [
    AppComponent,
    MainSearchBarComponent,
    ResultsItemsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
