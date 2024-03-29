import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { ExtrasComponent } from './components/extras/extras.component';

const routes: Routes = [
  { path: "", component: IndexComponent },
  { path: "extras", component: ExtrasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
