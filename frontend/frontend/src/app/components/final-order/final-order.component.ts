import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-final-order',
  templateUrl: './final-order.component.html',
  styleUrls: ['./final-order.component.css']
})
export class FinalOrderComponent implements OnInit{
  name: string = "";
  surname: string = "";
  email: string = "";
  phone: string = "";
  pickup: string = "";
  location: string = "";
  postal: string = "";
  city: string = "";
  address: string = "";
  comment: string = "";
  photosBlob: Blob[] = [];
  extrasBlob: Blob[] = [];
  
  ngOnInit(): void {
    let n = localStorage.getItem("name");
    let s = localStorage.getItem("surname");
    let e = localStorage.getItem("email");
    let ph = localStorage.getItem("phone");
    let pi = localStorage.getItem("pickup");
    let l = localStorage.getItem("location");
    let po = localStorage.getItem("postal");
    let ci = localStorage.getItem("city");
    let a = localStorage.getItem("address");
    let co = localStorage.getItem("comment");
    let pb = localStorage.getItem("photos");
    let eb = localStorage.getItem("extras");
    if(n != null && s != null && e != null && ph != null && pi != null && l != null && po != null && ci != null && a != null && co != null && pb != null && eb != null){
      this.name = n;
      this.surname = s;
      this.email = e;
      this.phone = ph;
      this.pickup = pi;
      this.location = l;
      this.postal = po;
      this.city = ci;
      this.address = a;
      this.comment = co;
      this.photosBlob = JSON.parse(pb);
      this.extrasBlob = JSON.parse(eb);
    }

  }


}
