import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';

declare var bootstrap: any; // This is for Bootstrap's JavaScript

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements AfterViewInit, OnInit {
  // You can use the non-null assertion operator (!) to tell TypeScript that the property will be initialized for sure, and it will not be null or undefined
  @ViewChild('notificationModal') modalElementRef!: ElementRef;
  @ViewChild('errorModal') modalError!: ElementRef;
  @ViewChild('photoInput') photoInput!: ElementRef;
  blobs: Blob[] = [];
  pictureFormats: string[] = [];
  imagePreviews: string[] = [];
  values: number[] = [];
  photoFormat: string = '';
  error: string = '';
  showError: boolean = false;
  paperBacking: string = 'mat';
  // for pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  firstTimeUploadedPhotos: boolean = true;

  // renderer is used for display modal
  constructor(
    private renderer: Renderer2,
    private uploadService: UploadService,
    private router: Router
  ) {}
  ngOnInit(): void {
    localStorage.removeItem('photos uploaded');
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.blobs.length / this.itemsPerPage);
  }
  
  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.imagePreviews.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  goToPage(page: number) {
    this.currentPage = page;
  }
  
  onPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // set all formats for all uploaded pictures 
  setAllFormats(event: Event){
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.photoFormat = target.value;
    }
    this.pictureFormats = [];
    for(let i = 0; i < this.blobs.length; i++){
      this.pictureFormats.push(this.photoFormat);
    }
  }

  // display modal on page load
  ngAfterViewInit(): void {
    const modalNative: HTMLElement = this.modalElementRef.nativeElement;
    const modal = new bootstrap.Modal(modalNative, {
      backdrop: 'static', // Prevents closing when clicking outside
      keyboard: false, // Prevents closing with the escape key
    });
    modal.show();
  }

  decrementValue(index: number) {
    this.values[index] = this.values[index] > 1 ? this.values[index] - 1 : 1;
  }

  incrementValue(index: number) {
    this.values[index] = this.values[index] + 1;
  }

  changeValue(index: number, event: Event) {
    // The target is asserted to be an HTMLInputElement
    const inputElement = event.target as HTMLInputElement;

    // Now you can safely access the value property
    const newValue = inputElement.value;

    const numericValue = parseInt(newValue, 10);
    if (!isNaN(numericValue)) {
      if(numericValue > 0){
        this.values[index] = numericValue;
      }else{
        this.values[index] = 1;
      }
      
    } else {
      // Handle the case where the new value is not a number
      this.values[index] = 1; // Or some other default value
    }
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.blobs.splice(index, 1);
    this.values.splice(index, 1);
    this.pictureFormats.splice(index, 1);
    this.setupPagination();
    if(this.totalPages < this.currentPage){
      this.currentPage = this.totalPages
    }
  }

  setImageStyles() {
    const styles = {
      height: '200px', // Set the desired height
      width: '100%', // Set width to 100% of the card width
      'object-fit': 'contain', // Ensures the entire image fits within the dimensions
      overflow: 'hidden', // Hides parts of the image that overflow the dimensions (just in case)
    };
    return Object.entries(styles)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
  }

  // adding photos
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files == null) return;
    if (!input.files.length) return;

    const files = input.files;
    // const blobs: Blob[] = [];

    for (let i = 0; i < files.length; i++) {
      const blob = new Blob([files[i]], { type: files[i].type });
      this.blobs.push(blob);
      this.values.push(1);

      // add photo format if it is selected
      if(this.photoFormat != ""){
        this.pictureFormats.push(this.photoFormat);
      }else{
        this.pictureFormats.push("izaberi");
      }
      // Here you can either upload each blob right away or collect them in an array to upload later

      // Create a FileReader to read the blob
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(blob);
    }
    this.setupPagination();
    if(this.firstTimeUploadedPhotos == true){
      this.currentPage = 1;
      this.firstTimeUploadedPhotos = false;
    }
    else{
      this.currentPage = this.totalPages;
    }
    

    // Example: Upload the first blob
    // This is just for demonstration, your upload method may differ
    this.uploadService.uploadImage(this.blobs[0]).subscribe(
      (response) => {
        console.log('Upload successful', response);
      },
      (error) => console.error('Error:', error)
    );
  }

  // switches between components
  next() {
    // error handling
    this.showError = false;
    this.error = '';
    if (this.blobs.length == 0) {
      this.error = 'Niste uneli ni jednu fotografiju.';
      this.showError = true;
    }
    if (this.pictureFormats.length == 0 && this.showError == false) {
      this.error = 'Morate izabrati format izrade fotografija.';
      this.showError = true;
    }

    if (this.showError) {
      const modalNative: HTMLElement = this.modalError.nativeElement;
      const modal = new bootstrap.Modal(modalNative, {
        backdrop: 'static', // Prevents closing when clicking outside
        keyboard: false, // Prevents closing with the escape key
      });
      modal.show();
      return;
    }
    localStorage.setItem('photosUploaded', String(this.blobs.length));
    localStorage.setItem('photos', JSON.stringify(this.blobs));
    this.router.navigate(['extras']);
  }
}
