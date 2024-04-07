import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {

  @ViewChild('errorModal') modalError!: ElementRef;
  pickupMethod:string = "licno";
  name: string = "";
  surname: string = "";
  phone: string = "";
  email: string = "";
  error: string = "";
  showError: boolean = false;
  postal: string = "";
  city: string = "";
  address: string = "";
  location: string = "Terazije 5";
  comment: string = "";

  constructor(private router: Router){

  }

  validateEmail(): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(this.email);
  }

  validatePhone(): boolean {
    const regex = /^[+]{0,1}[0-9-]+$/;
    return regex.test(this.phone);
  }

  validatePostal(): boolean{
    const regex = /^[0-9]{5}$/;
    return regex.test(this.postal);
  }

  validations(){
    if(this.name == ""){
      this.error = "Polje sa imenom mora biti popunjeno.";
      this.showError = true;
      return;
    }
    if(this.surname == ""){
      this.error = "Polje sa prezimenom mora biti popunjeno.";
      this.showError = true;
      return;
    }
    if(this.phone == ""){
      this.error = "Polje sa brojem telefona mora biti popunjeno.";
      this.showError = true;
      return;
    }
    if(this.email == ""){
      this.error = "Polje sa mejlom mora biti popunjeno.";
      this.showError = true;
      return;
    }
    if(!this.validateEmail()){
      this.error = "Polje mejl nije u odgovarajućem formatu.";
      this.showError = true;
      return;
    }
    if(!this.validatePhone()){
      this.error = "Polje telefon nije u odgovarajućem formatu.";
      this.showError = true;
      return;
    }
    if(this.pickupMethod == "kurir"){
      if(this.postal == ""){
        this.error = "Polje sa poštanskim brojem mora biti popunjeno.";
        this.showError = true;
        return;
      }
      if(this.city == ""){
        this.error = "Polje sa gradom mora biti popunjeno.";
        this.showError = true;
        return;
      }
      if(this.address == ""){
        this.error = "Polje sa adresa mora biti popunjeno.";
        this.showError = true;
        return;
      }
      if(!this.validatePostal()){
        this.error = "Polje sa poštanskim brojem mora biti popunjeno u odgovarajućem formatu (pet cifara).";
        this.showError = true;
        return;
      }
    }
  }

  next(){
    this.error = "";
    this.showError = false;
    this.validations();
    if(this.showError){
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false // Prevents closing with the escape key
      });
      modal.show();
      return;
    }
    localStorage.setItem("name", this.name);
    localStorage.setItem("surname", this.surname);
    localStorage.setItem("email", this.email);
    localStorage.setItem("phone", this.phone);
    localStorage.setItem("pickup", this.pickupMethod);
    localStorage.setItem("location", this.location);
    localStorage.setItem("postal", this.postal);
    localStorage.setItem("city", this.city);
    localStorage.setItem("address", this.address);
    localStorage.setItem("comment", this.comment);
    this.router.navigate(["final"]);
  }

}
