import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  @ViewChild('errorModal') modalError!: ElementRef;
  pickupMethod: string = "licno";
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
  promo: string = "";
  numberOfPictures: number = 0;
  numberOfExtras: number = 0;
  dimensions: string[] = [];
  totalPrice: number = 0;
  extrasChosen: string = "";

  constructor(private router: Router, private _eref: ElementRef) {

  }
  ngOnInit(): void {
    let nop = localStorage.getItem("imageBlobsLength");
    let noe = localStorage.getItem("extrasLength");
    let dim = localStorage.getItem("imageFormats");
    let ec = localStorage.getItem("extrasChosen");
    if (nop != null && noe != null && dim != null && ec != null) {
      this.numberOfPictures = JSON.parse(nop);
      this.numberOfExtras = JSON.parse(noe) / 6;
      this.dimensions = JSON.parse(dim);
      this.extrasChosen = JSON.parse(ec);
      this.calcTotalPrice();
    }
  }

  calcTotalPrice() {
    let formatAppearances = new Map<string, number>();
    let prices = new Map<string, number>();
    prices.set("9x13", 45);
    prices.set("10x15", 50);
    prices.set("13x18", 70);
    prices.set("15x21", 80);
    prices.set("15x30", 150);
    prices.set("20x25", 250);
    prices.set("20x30", 350);
    prices.set("30x40", 850);
    prices.set("20x50", 1500);
    prices.set("50x70", 2500);
    prices.set("polaroid", 70);
    for (let i = 0; i < this.dimensions.length; i++) {
      let dimension = this.dimensions[i];
      let currentCount = formatAppearances.get(dimension);
      if (typeof currentCount === 'number') {
        formatAppearances.set(dimension, currentCount + 1);
      } else {
        // If the dimension is not in the map, add it with a count of 1.
        formatAppearances.set(dimension, 1);
      }
    }

    // set totalPrice attribute to final price
    formatAppearances.forEach((value, key) => {
      if (key == '9x13') {
        if (value < 50) {
          this.totalPrice += value * 45;
        } else if (value >= 50 && value < 100) {
          this.totalPrice += value * 25;
        } else {
          this.totalPrice += value * 13.99;
        }
      } else if (key == '10x15') {
        if (value < 50) {
          this.totalPrice += value * 50;
        } else if (value >= 50 && value < 100) {
          this.totalPrice += value * 25;
        } else {
          this.totalPrice += value * 15.99;
        }
      } else if (key == '13x18') {
        if (value < 50) {
          this.totalPrice += value * 70;
        } else if (value >= 50 && value < 100) {
          this.totalPrice += value * 35;
        } else {
          this.totalPrice += value * 24.99;
        }
      } else if (key == 'polaroid') {
        if (value <= 25) {
          this.totalPrice += value * 70;
        } else {
          this.totalPrice += value * 25;
        }
      } else {
        const price = prices.get(key);
        if(price !== undefined){
          this.totalPrice += value * price;
        }
      }
    });
  }

  // slide panel
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const slidePanelContent = this._eref.nativeElement.querySelector('#slidePanelContent');

    if (slidePanelContent && !slidePanelContent.contains(event.target)) {
      // Check if the slide panel is currently shown
      if (slidePanelContent.classList.contains('show')) {
        // Toggle the panel to hide it
        slidePanelContent.classList.remove('show');
      }
    }
  }

  validateEmail(): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(this.email);
  }

  validatePhone(): boolean {
    const regex = /^[+]{0,1}[0-9-]+$/;
    return regex.test(this.phone);
  }

  validatePostal(): boolean {
    const regex = /^[0-9]{5}$/;
    return regex.test(this.postal);
  }

  validations() {
    if (this.name == "") {
      this.error = "Polje sa imenom mora biti popunjeno.";
      this.showError = true;
      return;
    }
    if (this.surname == "") {
      this.error = "Polje sa prezimenom mora biti popunjeno.";
      this.showError = true;
      return;
    }
    if (this.phone == "") {
      this.error = "Polje sa brojem telefona mora biti popunjeno.";
      this.showError = true;
      return;
    }
    if (this.email == "") {
      this.error = "Polje sa mejlom mora biti popunjeno.";
      this.showError = true;
      return;
    }
    // if(!this.validateEmail()){
    //   this.error = "Polje mejl nije u odgovarajućem formatu.";
    //   this.showError = true;
    //   return;
    // }
    // if(!this.validatePhone()){
    //   this.error = "Polje telefon nije u odgovarajućem formatu.";
    //   this.showError = true;
    //   return;
    // }
    if (this.pickupMethod == "kurir") {
      if (this.postal == "") {
        this.error = "Polje sa poštanskim brojem mora biti popunjeno.";
        this.showError = true;
        return;
      }
      if (this.city == "") {
        this.error = "Polje sa gradom mora biti popunjeno.";
        this.showError = true;
        return;
      }
      if (this.address == "") {
        this.error = "Polje sa adresa mora biti popunjeno.";
        this.showError = true;
        return;
      }
      // if(!this.validatePostal()){
      //   this.error = "Polje sa poštanskim brojem mora biti popunjeno u odgovarajućem formatu (pet cifara).";
      //   this.showError = true;
      //   return;
      // }
    }
  }

  next() {
    this.error = "";
    this.showError = false;
    this.validations();
    if (this.showError) {
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
