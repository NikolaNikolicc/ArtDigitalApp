import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IndexHeaderComponent } from './components/index-header/index-header.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { FinalOrderComponent } from './components/final-order/final-order.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    IndexHeaderComponent,
    ExtrasComponent,
    OrderDetailsComponent,
    FinalOrderComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
