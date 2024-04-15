import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-index-header',
  templateUrl: './index-header.component.html',
  styleUrls: ['./index-header.component.css']
})
export class IndexHeaderComponent{
  @ViewChild('priceModal') priceModalRef!: ElementRef;
  @ViewChild('offcanvasNavbar') offCanvasRef!: ElementRef;
  private offcanvas: any;

  constructor(private router: Router){

  }

  ngAfterViewInit() {
    // Initialize the offcanvas instance after view initialization
    const offcanvasNative: HTMLElement = this.offCanvasRef.nativeElement;
    this.offcanvas = new bootstrap.Offcanvas(offcanvasNative);
  }

  startAgain(){
    this.offcanvas.hide();
    localStorage.clear();
    this.router.navigate([""]);
  }

  openPriceModal() {
    this.offcanvas.hide();
    this.showPriceModal();
  }
  
  showPriceModal() {
    // Now show the modal for prices
    const modalNative: HTMLElement = this.priceModalRef.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static',
      keyboard: false,
    });
    modal.show();
  }
  
}
