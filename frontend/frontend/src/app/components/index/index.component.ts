import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements AfterViewInit, OnInit {

  // You can use the non-null assertion operator (!) to tell TypeScript that the property will be initialized for sure, and it will not be null or undefined
  @ViewChild('notificationModal') modalElementRef!: ElementRef;
  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('photoInput') photoInput!: ElementRef;
  blobs: Blob[] = [];
  photoFormat: String = "";
  error: String = "";
  showError: boolean = false;

  // renderer is used for display modal
  constructor(private renderer: Renderer2, private uploadService: UploadService, private router: Router) {}
  ngOnInit(): void {
    localStorage.removeItem("photos uploaded");
  }

  // display modal on page load
  ngAfterViewInit(): void {
    const modalNative: HTMLElement = this.modalElementRef.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false // Prevents closing with the escape key
    });
    modal.show();
  }

  // adding photos
  onFilesSelected(event: Event) {
    localStorage.setItem("photos uploaded", "true")

    const input = event.target as HTMLInputElement;
    if(input.files == null)return;
    if (!input.files.length) return;

    const files = input.files;
    // const blobs: Blob[] = [];

    for (let i = 0; i < files.length; i++) {
      const blob = new Blob([files[i]], { type: files[i].type });
      this.blobs.push(blob);
      // Here you can either upload each blob right away or collect them in an array to upload later
    }

    // Example: Upload the first blob
    // This is just for demonstration, your upload method may differ
    this.uploadService.uploadImage(this.blobs[0]).subscribe(
      response => {
        console.log('Upload successful', response)
        
      },
      error => console.error('Error:', error)
    );
  }

  // switches between components
  photosAdded(){
    // error handling
    this.showError = false;
    this.error = "";
    let pu = localStorage.getItem("photos uploaded");
    if(pu == null){
      this.error = "Niste uneli ni jednu fotografiju.";
      this.showError = true;
    }
    if(this.photoFormat == "" && this.showError == false){
      this.error = "Morate izabrati format izrade fotografija.";
      this.showError = true;
    }

    if(this.showError){
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false // Prevents closing with the escape key
      });
      modal.show();
      return;
    }
    this.router.navigate(["extras"]);
  }

}
