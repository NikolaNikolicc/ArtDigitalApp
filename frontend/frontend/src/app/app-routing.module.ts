import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { ExtrasComponent } from './components/extras/extras.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { FinalOrderComponent } from './components/final-order/final-order.component';

const routes: Routes = [
  { path: "", component: IndexComponent },
  { path: "extras", component: ExtrasComponent },
  { path: "details", component: OrderDetailsComponent },
  { path: "final", component: FinalOrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
