import { Component } from '@angular/core';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.css']
})
export class ExtrasComponent {
  error: String = "";
  showError: boolean = false;
  extras: String = "ne";

  chooseLocation(){

  }
}
